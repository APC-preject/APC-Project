const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const adminKey = require('./unity-apc-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(adminKey),
  databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com/'
});

const db = admin.database();
const app = express();
const PORT = 4004;
app.use(express.json());
app.use(cors());

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
  
  const userRef = db.ref(`users/${userId}`);
  userRef.child('password').once('value', async (snapshot) => {
    const storedPassword = snapshot.val();
    if (storedPassword === currentPassword) {
      await userRef.child('password').set(newPassword);
      res.send('Password updated successfully');
    } else {
      res.status(400).send('Current password does not match');
    }
  }, error => {
    res.status(500).send('Error updating password:', error);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
