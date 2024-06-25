const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const adminKey = require('./unity-apc-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const app = express();
const port = 4003;

app.use(cors());
app.use(express.json());

// 사용자 정보 가져오기
app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const ref = db.ref(`users/${userId}`);
    try {
      const snapshot = await ref.once('value');
      if(snapshot.exists()) {
        res.status(200).send(snapshot.val());
      } else {
        res.status(404).send('No data available');
      }
    } catch(error) {
      res.status(500).send(error.message);
    }
  });
  
  // 비밀번호 변경
  app.post('/users/:userId/password', async (req, res) => {
    const { currentPwd, newPwd } = req.body;
    const userI = req.params.userId;
    const ref = db.ref(`users/${userId}`);
    try { 
        const snapshot = await ref.once('value');
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.password === currentPwd) {
                await db.ref(`users/${userId}/password`).set(newPwd);
                res.status(200).send('Password updated successfully');
            } else {
                res.status(400).send('Current password does not match');
            }
        } else {
            res.status(404).send('No data available');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
  });

// 회원 가입
app.post('/register', async (req, res) => {
    const { email, name, password, role, apcID } = req.body;
    const id = email.replace(".", "_");
    let userData = {
      email,
      name,
      password,
      uid: id,
      role: role || 0
    };
    if (role === 1) {
      userData.apcID = apcID;
      userData.online = 0;
    }
    try {
      const updates = {};
      updates[`users/${id}`] = userData;
      await db.ref().update(updates);
      res.status(201).send('User registered successfully');
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  // 로그인
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userId = email.replace(".", "_");
    const ref = db.ref(`users/${userId}`);
    try {
      const snapshot = await ref.once('value');
      if(snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
          res.status(200).send({ id: userId, role: userData.role });
        } else {
          res.status(400).send('Invalid password');
        }
      } else {
        res.status(404).send('No data available');
      }
    } catch(error) {
      res.status(500).send(error.message);
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });