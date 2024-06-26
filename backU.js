const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const axios = require('axios');
const adminKey = require('./unity-apc-firebase-adminsdk.json');
const dotenv = require('dotenv');
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
const PORT = 4004;
const corsOptions = {
  origin: 'http://localhost:4001', // 클라이언트 도메인
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


// 사용자 정보 받기(내 정보 페이지)
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const userRef = db.ref(`users/${userId}`);
  userRef.once('value', snapshot => {
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.status(404).send('User not found');
    }
  }, error => {
    res.status(500).send('Error getting user data:', error);
  });
});

// 비밀번호 변경
app.post('/user/:id/password', async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  const idToken = req.cookies?.idToken;
  
  const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;

  try {
    const response = await axios.post(FIREBASE_AUTH_URL, {
      idToken: idToken,
      password: newPassword,
      returnSecureToken: true
    });
    if (response.data.error) {
      console.log("asdf");
      throw new Error('Error updating password');
    }
    const newidToken = response.data.idToken;

    res.cookie('idToken', newidToken, {
      httpOnly: true,
      secure: false, // process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
      // maxAge: response.data.expiresIn * 1000 // session cookie로 만들어 탭 닫으면 쿠키 삭제
    });
  } catch (error) {
    console.log('Error updating password:');
    res.status(500).send('Error updating password');
    return ;
  }
  const userRef = db.ref(`users/${userId}`);
  userRef.child('password').once('value', async (snapshot) => {
    const storedPassword = snapshot.val();
    if (storedPassword === currentPassword) {
      await userRef.child('password').set(newPassword);
      res.send('Password updated successfully');
    } else {
      console.log('Current password does not match');
      res.status(400).send('Current password does not match');
    }
  }, error => {
    console.log('Error updating password:');
    res.status(500).send('Error updating password:');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
