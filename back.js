const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const adminKey = require('./secrets/unity-apc-firebase-adminsdk.json');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const { getAuth } = require('firebase-admin/auth');
const cookieParser = require('cookie-parser');

dotenv.config({path: './secrets/.env'}); // .env 파일에서 환경변수 로드

const {
  // firebase config
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,

  // server config
  PORT,
  HOST,
  FRONT_ORIGIN_URL,
  NODE_ENV,
  NGROK_URL
} = process.env; // 환경변수 가져오기

if (NGROK_URL === undefined) {
  console.error('NGROK_URL is not defined');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com/'
}); // firebase admin 초기화

const db = admin.database(); // firebase database 초기화
const app = express(); // express 서버 생성

const corsOptions = {
  origin: [FRONT_ORIGIN_URL, NGROK_URL], // 클라이언트 도메인
  credentials: true, // 쿠키 전달 허용
}; // cors 옵션

app.use(cors(corsOptions)); // cors 미들웨어
app.use(express.json()); // json 파싱 미들웨어
app.use(express.urlencoded({ extended: true })); // urlencoded 파싱 미들웨어
app.use(cookieParser()); // 쿠키 파싱 미들웨어

// 로그인 요청 처리
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // firebase rest api를 이용한 로그인
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  
  try {
    const response = await axios.post(FIREBASE_AUTH_URL, {
      email,
      password,
      returnSecureToken: true
    }); // firebase auth 서버에 로그인 요청
    if (response.data.error) {
      throw new Error('Invalid email or password');
    } // 로그인 실패 시 에러 발생

    const idToken = response.data.idToken; // idToken 추출

    res.cookie('idToken', idToken, { // 쿠키로 idToken 전송
      httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
      secure: true, // NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
      // maxAge: response.data.expiresIn * 1000 // session cookie로 만들어 탭 닫으면 쿠키 삭제
      sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
    });

    const userId = email.replace(".", "_");
    const snapshot = await db.ref(`users/${userId}/role`).get(); // db에서 유저의 role 가져오기
    if (snapshot.exists()) { // 유저 정보가 있을 시
      const loggedInUserRole = snapshot.val();
      res.status(200).json({ 
        userId: userId, 
        loggedInUserRole: loggedInUserRole
      }); // role과 userId 전송(로그인 성공)
    } else {
      res.status(404).json({ message: 'User not found' }); // 유저 정보 없을 시 에러
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid email or password' }); // 로그인 실패 시 에러
  }
});

// 로그아웃 요청 처리
app.post('/logout', (req, res) => {
  res.clearCookie('idToken'); // 쿠키 삭제
  res.status(200).json({ message: 'Logged out' });
});

// 회원가입 요청 처리
app.post('/register', async (req, res) => {
  const { 
    email, password, name, role, apcID
  } = req.body; // 요청 바디에서 이메일, 비밀번호, 이름, role, apcID 추출
  // firebase rest api를 이용한 회원가입
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  try {
    const response = await axios.post(FIREBASE_AUTH_URL, {
      email,
      password,
      returnSecureToken: true
    }); // firebase auth 서버에 회원가입 요청
    if (response.data.error) { // 회원가입 실패 시 에러 발생
      throw new Error('Register failed');
    }
    const uid = response.data.localId; // uid 추출
    const userData = {
      email: email,
      name: name,
      password: password,
      uid: uid,
      role : role
    }; // 유저 데이터 생성
    if (role === 1) { // 판매자인 경우 apcId와 online 여부 항목 추가
      userData['apcID'] = apcID;
      userData['online'] = 0;
    }

    const userId = email.replace(".", "_");
    const userRef = db.ref();
    const updates = {};
    updates[`users/${userId}`] = userData;
    await userRef.update(updates); // db에 유저 데이터 저장

    res.status(200).json({ message: '회원가입 성공' });
  } catch (error) { // 회원가입 실패 시 에러 처리
    console.error('Error creating user: ', error);
    res.status(500).json({ message: '회원가입 실패', error });
  }
});

// 토큰 검증 미들웨어
app.use(async (req, res, next) => {
  const idToken = req.cookies?.idToken; // 쿠키에서 idToken 추출
  if (!idToken) { // idToken이 없을 시 에러(미인증)
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken); // idToken 검증
    req.userEmail = decodedToken.email?.replace(".", "_"); // 토근에서 이메일 추출
    console.log(req.userEmail);
    next(); // 다음 미들웨어(라우터)로 이동
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/config/firebase', async (req, res) => {
  res.status(200).json({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
  })
});

// 사용자 주문정보 가져오기
app.get('/orders/:id', async (req, res) => {
  const { id } = req.params; // id 파라미터 추출
  const orderRef = db.ref(`orders/${id}`); // 주문 정보가 있는 db 레퍼런스
  try {
    const snapshot = await orderRef.once('value'); // 주문 정보 가져오기
    if (snapshot.exists()) { // 주문 정보가 있을 시
      res.status(200).json(snapshot.val());
    } else { // 주문 정보가 없을 시
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) { // 주문 정보 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// 사용자 특정 주문정보 가져오기 
app.get('/orders/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params; // id, orderid 파라미터 추출
  const orderRef = db.ref(`orders/${id}/${orderid}`); // 주문 정보가 있는 db 레퍼런스
  try {
    const snapshot = await orderRef.get(orderRef); // 주문 정보 가져오기
    if (snapshot.exists()) { // 주문 정보가 있을 시
      res.status(200).json(snapshot.val());
    } else { // 주문 정보가 없을 시
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) { // 주문 정보 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

// 배송 시작 처리
app.post('/ordersGo/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params; // id, orderid 파라미터 추출
  const { trackingNumber, productId, userId } = req.body;
  const orderRef = db.ref(); // DB root 레퍼런스
  try {
    if (!trackingNumber || trackingNumber === '') { // 운송장 번호가 없을 시
      res.status(400).json({ message: 'Tracking number is required' });
      return;
    }
    const departedDate = new Date().toLocaleString(); // 출발일 생성
    const updates = {} // 업데이트할 데이터
    updates[`orders/${userId}/${orderid}/departedDate`] = departedDate // 출발일 업데이트
    updates[`orders/${userId}/${orderid}/deliveryStatus`] = 1 // 배송 상태 업데이트
    updates[`deliveryWaits/${id}/${productId}/${orderid}/deliveryStatus`] = 1 // 배송 대기 상태 업데이트
    updates[`orders/${userId}/${orderid}/trackingNum`] = trackingNumber // 운송장 번호 업데이트
    await orderRef.update(updates); // 데이터 업데이트
    res.status(200).json({ message: 'Departed' });
  } catch (error) { // 업데이트 실패 시
    console.log(error);
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// 배송 완료 처리
app.post('/ordersArrive/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params; // id, orderid 파라미터 추출
  const { productId, userId } = req.body; // body에서 productId, userId 추출
  const orderRef = db.ref(); // DB root 레퍼런스
  try {
    const arrivedDate = new Date().toLocaleString(); // 도착일 생성
    const updates = {} // 업데이트할 데이터
    updates[`orders/${userId}/${orderid}/arrivedDate`] = arrivedDate // 도착일 업데이트
    updates[`orders/${userId}/${orderid}/deliveryStatus`] = 2 // 배송 상태 업데이트
    updates[`deliveryWaits/${id}/${productId}/${orderid}`] = null // 배송 대기 목록에서 삭제
    await orderRef.update(updates); // 데이터 업데이트
    res.status(200).json({ message: 'Departed' });
  } catch (error) { // 업데이트 실패 시
    res.status(500).json({ message: 'Error updating order', error });
  }
});

// 배송 대기 목록 가져오기
app.get('/deliveryWaits/:providerId', async (req, res) => {
  const { providerId } = req.params; // providerId 파라미터 추출
  const deliveryRef = db.ref(`deliveryWaits/${providerId}`); // 배송 대기 목록 레퍼런스
  try {
    const snapshot = await deliveryRef.get(); // 배송 대기 목록 가져오기
    if (snapshot.exists()) { // 배송 대기 목록이 있을 시
      res.status(200).json(snapshot.val());
    } else { // 배송 대기 목록이 없을 시
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) { // 배송 대기 목록 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching deliveryWaits', error });
  }
});

// 상품 목록 가져오기
app.get('/products', async (req, res) => {
  const productRef = db.ref(`products`); // 상품 목록 레퍼런스
  try {
    const snapshot = await productRef.get(); // 상품 목록 가져오기
    if (snapshot.exists()) { // 상품 목록이 있을 시
      res.status(200).json(snapshot.val());
    } else { // 상품 목록이 없을 시
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) { // 상품 목록 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching deliveryWaits', error });
  }
});

// 상품 등록
app.post('/products', async (req, res) => {
  const {product_data} = req.body; // body에서 product_data 추출
  const productRef = db.ref(`products`); // 상품 목록 레퍼런스
  try {
    const result = await productRef.push(product_data); // 상품 등록
    if (result) { // 상품 등록 성공 시
      res.status(200).json(product_data);
    } else { // 상품 등록 실패 시
      res.status(404).json({ message: 'product can\'t register' });
    }
  } catch (error) { // 상품 등록 실패 시
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

const multstorage = multer.memoryStorage(); // multer 스토리지 설정
const upload = multer({ storage: multstorage }); // multer 업로드 설정

// 상품 이미지 업로드
app.post('/productImages/:name', upload.single('image'), async (req, res) => {
  const { name } = req.params; // name 파라미터 추출
  const image = req.file.buffer; // 이미지 데이터 추출
  const bucket = admin.storage().bucket('unity-apc.appspot.com'); // 이미지 저장 버킷(스토리지)
  try {
    const file = bucket.file(`product_images/${name}`); // 이미지 파일 생성
    await file.save(image, { // 이미지 저장
      metadata: { contentType: req.file.mimetype } // 이미지 타입 설정
    });
    const url = await file.getSignedUrl({ // 이미지 URL 생성
      action: 'read', // Read access
      expires: '03-01-2500' // URL expiration date(임의 시간)
    });
    res.status(200).json({ url: url[0] }); // 이미지 URL 전송
  } catch (error) { // 이미지 업로드 실패 시
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// 상품 정보 가져오기
app.get('/products/:productId', async (req, res) => {
  const productId = req.params.productId; // productId 파라미터 추출
  const productRef = db.ref(`products/${productId}`); // 상품 정보 레퍼런스
  try {
    const snapshot = await productRef.get(); // 상품 정보 가져오기
    if (snapshot.exists()) { // 상품 정보가 있을 시
      res.status(200).json(snapshot.val());
    } else { // 상품 정보가 없을 시
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) { // 상품 정보 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching Product', error });
  }
});

// 상품별 리뷰 정보 가져오기
app.get('/reviews/:productId', async (req, res) => {
  const productId = req.params.productId; // productId 파라미터 추출
  const reviewRef = db.ref(`reviews/${productId}`); // 리뷰 정보 레퍼런스
  try {
    const snapshot = await reviewRef.get(); // 리뷰 정보 가져오기
    if (snapshot.exists()) { // 리뷰 정보가 있을 시
      res.status(200).json(snapshot.val());
    } else { // 리뷰 정보가 없을 시
      res.status(404).json({ message: 'review not found' });
    }
  } catch (error) { // 리뷰 정보 가져오기 실패 시
    res.status(500).json({ message: 'Error fetching review', error });
  }
});

// 주문하기
app.post('/orders', async (req, res) => {
  // 주문 정보, 배송 대기 정보, id, productId, quantity, provider_Name, orderedPrice 추출
  const {newOrder, newDeliveryWait, id, productId, quantity, provider_Name, orderedPrice} = req.body;
  const orderRef = db.ref(`orders/${id}`); // 주문 정보 레퍼런스
  try {
    const productRef = db.ref(`products/${productId}`); // 상품 정보 레퍼런스

    await productRef.transaction((product) => { // 상품 정보 업데이트
      if (product) {
        if (product.pQuantity >= quantity) { // 주문 수량이 재고 수량보다 작을 시
          product.pQuantity -= quantity;
        } else { // 주문 수량이 재고 수량보다 클 시
          throw new Error('주문 수량이 재고 수량보다 많습니다.');
        }
      }
      return product;
    });

    try {
      // 주문 정보 db에 저장
      const newOrderRef = orderRef.push(); // 주문 정보 레퍼런스 생성

      const orderID = newOrderRef.key; // 주문 ID 생성

      const updates = {}; // 업데이트할 데이터
      updates[`orders/${id}/${orderID}`] = newOrder; // 주문 정보 업데이트
      updates[`deliveryWaits/${provider_Name}/${productId}/${orderID}`] = newDeliveryWait; // 배송 대기 정보 업데이트
      // 주문 관련 데이터 동시 업데이트 (원자성 만족)
      await db.ref().update(updates); // 데이터 업데이트

      res.status(200).json({ message: `총 ${quantity}kg 주문하셨습니다. 가격은 ${orderedPrice}원 입니다.` });
    } catch (error) { // 주문 데이터 저장 실패 시
      // 주문 데이터 저장 중 문제 생겼으니 뺏던 수량 원상 복구
      await productRef.transaction((product) => {
        if (product) {
          product.pQuantity += quantity; // 주문 수량만큼 재고 수량 복구
        }
        return product;
      });
      console.log(error);
      res.status(500).json({ message: '주문 데이터 저장 중 문제가 발생했습니다.', error });
    }
  } catch (error) { // 상품 정보 업데이트 실패 시
    console.log(error);
    res.status(500).json({ message: '수량 확인 및 업데이트 중 문제가 발생했습니다.', error });
  }
});

// 유저 문의 리스트 가져오기
app.get('/userQuestions/:userId', async (req, res) => {
  const userId = req.params.userId; // userId 파라미터 추출
  const ref = db.ref(`userQuestions/${userId}`); // 유저 문의 레퍼런스
  try {
    const snapshot = await ref.once('value'); // 유저 문의 리스트 가져오기
    if(snapshot.exists()) { // 유저 문의 리스트가 있을 시
      res.status(200).send(snapshot.val());
    } else { // 유저 문의 리스트가 없을 시
      res.status(404).send('No data available');
    }
  } catch(error) { // 유저 문의 리스트 가져오기 실패 시
    res.status(500).send(error.message);
  }
});

// 전체 문의 리스트 가져오기
app.get('/questions', async (req, res) => {
  const ref = db.ref('questions'); // 전체 문의 레퍼런스
  try {
    const snapshot = await ref.once('value'); // 전체 문의 리스트 가져오기
    if (snapshot.exists()) { // 전체 문의 리스트가 있을 시
      res.status(200).send(snapshot.val());
    } else { // 전체 문의 리스트가 없을 시
      res.status(404).send('No data available');
    }
  } catch (error) { // 전체 문의 리스트 가져오기 실패 시
    res.status(500).send(error.message);
  }
});

// 특정 문의 가져오기
app.get('/questions/:questionId', async (req, res) => {
  const questionId = req.params.questionId; // questionId 파라미터 추출
  const ref = db.ref(`questions/${questionId}`); // 특정 문의 레퍼런스
  try {
    const snapshot = await ref.once('value'); // 특정 문의 가져오기
    if (snapshot.exists()) { // 특정 문의가 있을 시
      res.status(200).send(snapshot.val());
    } else { // 특정 문의가 없을 시
      res.status(404).send('No data available');
    }
  } catch (error) { // 특정 문의 가져오기 실패 시
    res.status(500).send(error.message);
  }
});

// 문의 작성
app.post('/questions', async (req, res) => {
  const { userId, questionData } = req.body; // userId, questionData 추출
  const newQuestionRef = db.ref('questions').push(); // 새로운 문의 레퍼런스 생성
  try {
    await newQuestionRef.set(questionData); // 새로운 문의 저장
    await db.ref(`userQuestions/${userId}/${newQuestionRef.key}`).set(questionData); // 유저 문의 저장
    res.status(201).send('Question created successfully');
  } catch (error) { // 문의 저장 실패 시
    res.status(500).send(error.message);
  }
});

// 문의 답변
app.post('/questions/:questionId/response', async (req, res) => {
  const questionId = req.params.questionId; // questionId 파라미터 추출
  const { response } = req.body; // response 추출
  try {
    await db.ref(`questions/${questionId}/response`).set(response); // 문의 답변 저장
    res.status(200).send('Response submitted successfully');
  } catch (error) { // 문의 답변 저장 실패 시
    res.status(500).send(error.message);
  }
});

// 특정 사용자 주문 정보 가져오기
app.get('/orders/:userId', async (req, res) => {
  const userId = req.params.userId; // userId 파라미터 추출
  const ref = db.ref(`orders/${userId}`); // 특정 사용자 주문 정보 레퍼런스
  try {
    const snapshot = await ref.once('value'); // 특정 사용자 주문 정보 가져오기
    if(snapshot.exists()) { // 특정 사용자 주문 정보가 있을 시
      res.status(200).send(snapshot.val());
    } else { // 특정 사용자 주문 정보가 없을 시
      res.status(404).send('No data available');
    }
  } catch(error) { // 특정 사용자 주문 정보 가져오기 실패 시
    res.status(500).send(error.message);
  }
});

// 특정 제품 정보 가져오기
app.get('/products/:productId', async (req, res) => {
  const productId = req.params.productId; // productId 파라미터 추출
  const ref = db.ref(`products/${productId}`); // 특정 제품 정보 레퍼런스
  try {
    const snapshot = await ref.once('value'); // 특정 제품 정보 가져오기
    if(snapshot.exists()) { // 특정 제품 정보가 있을 시
      res.status(200).send(snapshot.val());
    } else { // 특정 제품 정보가 없을 시
      res.status(404).send('No data available');
    }
  } catch(error) { // 특정 제품 정보 가져오기 실패 시
    res.status(500).send(error.message);
  }
});

// 사용자가 쓴 리뷰 올리고 해당 제품 리뷰 올린거 업데이트
app.post('/reviews', async (req, res) => {
  const { userId, productId, orderId, reviewData } = req.body; // userId, productId, orderId, reviewData 추출
  const reviewKey = db.ref(`reviews/${productId}`).push().key; // 리뷰 키 생성
  const updates = {}; // 업데이트할 데이터
  updates[`reviews/${productId}/${reviewKey}`] = reviewData; // 리뷰 정보 업데이트
  updates[`orders/${userId}/${orderId}/isReviewed`] = 1; // 리뷰 작성 여부 업데이트
  try {
      await db.ref().update(updates); // 데이터 업데이트
      res.status(201).send('Review created successfully and order updated');
  } catch (error) { // 리뷰 저장 실패 시
      res.status(500).send(error.message);
  }
});

// 사용자 정보 받기(내 정보 페이지)
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id; // userId 파라미터 추출
  const userRef = db.ref(`users/${userId}`); // 사용자 정보 레퍼런스
  userRef.once('value', snapshot => { // 사용자 정보 가져오기
    if (snapshot.exists()) { // 사용자 정보가 있을 시
      res.json(snapshot.val());
    } else { // 사용자 정보가 없을 시
      res.status(404).send('User not found');
    }
  }, error => { // 사용자 정보 가져오기 실패 시
    res.status(500).send('Error getting user data:', error);
  });
});

// 비밀번호 변경
app.post('/user/:id/password', async (req, res) => {
  const userId = req.params.id; // userId 파라미터 추출
  const { currentPassword, newPassword } = req.body; // currentPassword, newPassword 추출
  const idToken = req.cookies?.idToken; // 쿠키에서 idToken 추출
  
  // firebase rest api를 이용한 비밀번호 변경
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;

  try {
    const response = await axios.post(FIREBASE_AUTH_URL, { // firebase auth 서버에 비밀번호 변경 요청
      idToken: idToken,
      password: newPassword,
      returnSecureToken: true
    });
    if (response.data.error) { // 비밀번호 변경 실패 시
      throw new Error('Error updating password');
    }
    const newidToken = response.data.idToken; // 새로운 idToken 추출

    res.cookie('idToken', newidToken, { // 쿠키로 새로운 idToken 전송
      httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
      secure: true, // NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
      // maxAge: response.data.expiresIn * 1000 // session cookie로 만들어 탭 닫으면 쿠키 삭제
      sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
    });
  } catch (error) { // 비밀번호 변경 실패 시
    console.log('Error updating password:');
    res.status(500).send('Error updating password');
    return ;
  }
  const userRef = db.ref(`users/${userId}`); // 사용자 정보 레퍼런스
  userRef.child('password').once('value', async (snapshot) => { // 사용자 비밀번호 가져오기
    const storedPassword = snapshot.val(); // 저장된 비밀번호 추출
    if (storedPassword === currentPassword) { // 현재 비밀번호가 일치할 시
      await userRef.child('password').set(newPassword); // 새로운 비밀번호로 업데이트
      res.send('Password updated successfully');
    } else { // 현재 비밀번호가 일치하지 않을 시
      console.log('Current password does not match'); // 에러 출력
      res.status(400).send('Current password does not match');
    }
  }, error => { // 사용자 비밀번호 가져오기 실패 시
    console.log('Error updating password:');
    res.status(500).send('Error updating password:');
  });
});

app.listen(PORT, () => { // 서버 실행
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
