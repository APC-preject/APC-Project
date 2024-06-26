const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const adminKey = require('./unity-apc-firebase-adminsdk.json');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
const { getAuth } = require('firebase-admin/auth');
const cookieParser = require('cookie-parser');
dotenv.config({path: './secrets/.env'});

const {
  API_KEY
} = process.env;

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const app = express();
const port = 4000;

const corsOptions = {
  origin: 'http://localhost:4001', // 클라이언트 도메인
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
  
  try {
    const response = await axios.post(FIREBASE_AUTH_URL, {
      email,
      password,
      returnSecureToken: true
    });
    if (response.data.error) {
      throw new Error('Invalid email or password');
    }
    const idToken = response.data.idToken;

    res.cookie('idToken', idToken, {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
      // maxAge: response.data.expiresIn * 1000 // session cookie로 만들어 탭 닫으면 쿠키 삭제
    });

    const userId = email.replace(".", "_");
    const snapshot = await db.ref(`users/${userId}/role`).get();
    if (snapshot.exists()) {
      const loggedInUserRole = snapshot.val();
      res.status(200).json({ 
        userId: userId, 
        loggedInUserRole: loggedInUserRole
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('idToken'); // 쿠키 삭제
  res.status(200).json({ message: 'Logged out' });
});

app.post('/register', async (req, res) => {
  const { 
    email, password, name, role, apcID, online
  } = req.body;
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
  try {
    const response = await axios.post(FIREBASE_AUTH_URL, {
      email,
      password,
      returnSecureToken: true
    });
    if (response.data.error) {
      throw new Error('Register failed');
    }
    const uid = response.data.localId;
    const userData = {
      email: email,
      name: name,
      password: password,
      uid: uid,
      role : role
    };
    // 판매자인 경우 apcId와 online 여부 항목 추가
    if (role === 1) {
      userData['apcID'] = apcID;
      userData['online'] = 0;
    }

    const userId = email.replace(".", "_");
    const userRef = db.ref();
    const updates = {};
    updates[`users/${userId}`] = userData;
    await userRef.update(updates);

    res.status(200).json({ message: '회원가입 성공' });
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ message: '회원가입 실패', error });
  }
});

app.use(async (req, res, next) => {
  const idToken = req.cookies?.idToken;
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.userEmail = decodedToken.email?.replace(".", "_");
    console.log(req.userEmail);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.get('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const orderRef = db.ref(`orders/${id}`);
  try {
    const snapshot = await orderRef.once('value');
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

app.get('/orders/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params;
  const orderRef = db.ref(`orders/${id}/${orderid}`);
  try {
    const snapshot = await orderRef.get(orderRef);
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
});

app.post('/ordersGo/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params;
  const { trackingNumber, productId, userId } = req.body;
  const orderRef = db.ref();
  try {
    if (trackingNumber === '') {
      res.status(400).json({ message: 'Tracking number is required' });
      return;
    }
    const departedDate = new Date().toLocaleString();
    const updates = {}
    updates[`orders/${userId}/${orderid}/departedDate`] = departedDate
    updates[`orders/${userId}/${orderid}/deliveryStatus`] = 1
    updates[`deliveryWaits/${id}/${productId}/${orderid}/deliveryStatus`] = 1 // id 와 userId 동일한 값인지 확인
    updates[`orders/${userId}/${orderid}/trackingNum`] = trackingNumber
    await orderRef.update(updates);
    res.status(200).json({ message: 'Departed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating order', error });
  }
});

app.post('/ordersArrive/:id/:orderid', async (req, res) => {
  const { id, orderid } = req.params;
  const { productId, userId } = req.body;
  const orderRef = db.ref();
  try {
    const arrivedDate = new Date().toLocaleString();
    const updates = {}
    updates[`orders/${userId}/${orderid}/arrivedDate`] = arrivedDate
    updates[`orders/${userId}/${orderid}/deliveryStatus`] = 2
    updates[`deliveryWaits/${id}/${productId}/${orderid}`] = null
    await orderRef.update(updates);
    res.status(200).json({ message: 'Departed' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

app.get('/deliveryWaits/:providerId', async (req, res) => {
  const { providerId } = req.params;
  const deliveryRef = db.ref(`deliveryWaits/${providerId}`);
  try {
    const snapshot = await deliveryRef.get();
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveryWaits', error });
  }
});

app.get('/products', async (req, res) => {
  const deliveryRef = db.ref(`products`);
  try {
    const snapshot = await deliveryRef.get();
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveryWaits', error });
  }
});

app.post('/products', async (req, res) => {
  const {product_data} = req.body;
  const productRef = db.ref(`products`);
  try {
    const result = await productRef.push(product_data);
    if (result) {
      res.status(200).json(product_data);
    } else {
      res.status(404).json({ message: 'product can\'t register' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

const multstorage = multer.memoryStorage();
const upload = multer({ storage: multstorage });

// image file 을 POST 로 받아서 firebase store 에 저장하는 API
app.post('/productImages/:name', upload.single('image'), async (req, res) => {
  const { name } = req.params;
  const image = req.file.buffer;
  const bucket = admin.storage().bucket('unity-apc.appspot.com');
  try {
    const file = bucket.file(`product_images/${name}`);
    await file.save(image, {
      metadata: { contentType: req.file.mimetype }
    });
    const url = await file.getSignedUrl({
      action: 'read', // Read access
      expires: '03-01-2500' // URL expiration date
    });
    res.status(200).json({ url: url[0] });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

app.get('/products/:productId', async (req, res) => {
  const productId = req.params.productId;
  const productRef = db.ref(`products/${productId}`);
  try {
    const snapshot = await productRef.get();
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Product', error });
  }
});

app.get('/reviews/:productId', async (req, res) => {
  const productId = req.params.productId;
  const reviewRef = db.ref(`reviews/${productId}`);
  try {
    const snapshot = await reviewRef.get();
    if (snapshot.exists()) {
      res.status(200).json(snapshot.val());
    } else {
      res.status(404).json({ message: 'review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review', error });
  }
});

app.post('/orders', async (req, res) => {
  const {newOrder, newDeliveryWait, id, productId, quantity, provider_Name, orderedPrice} = req.body;
  const orderRef = db.ref(`orders/${id}`);
  try {
    const productRef = db.ref(`products/${productId}`);

    await productRef.transaction((product) => {
      if (product) {
        if (product.pQuantity >= quantity) {
          product.pQuantity -= quantity;
        } else {
          throw new Error('주문 수량이 재고 수량보다 많습니다.');
        }
      }
      return product;
    });

    try {
      // 주문 정보 db에 저장
      const newOrderRef = orderRef.push();

      const orderID = newOrderRef.key;

      const updates = {};
      updates[`orders/${id}/${orderID}`] = newOrder;
      updates[`deliveryWaits/${provider_Name}/${productId}/${orderID}`] = newDeliveryWait;
      // 주문 관련 데이터 동시 업데이트 (원자성 만족)
      await db.ref().update(updates);

      res.status(200).json({ message: `총 ${quantity}kg 주문하셨습니다. 가격은 ${orderedPrice}원 입니다.` });
    } catch (error) {
      // 주문 데이터 저장 중 문제 생겼으니 뺏던 수량 원상 복구
      await productRef.transaction((product) => {
        if (product) {
          product.pQuantity += quantity;
        }
        return product;
      });
      console.log(error);
      res.status(500).json({ message: '주문 데이터 저장 중 문제가 발생했습니다.', error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: '수량 확인 및 업데이트 중 문제가 발생했습니다.', error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
