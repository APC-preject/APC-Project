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
const port = 4002;

app.use(cors());
app.use(express.json());

// 특정 사용자 주문 정보 가져오기
app.get('/orders/:userId', async (req, res) => {
    const userId = req.params.userId;
    const ref = db.ref(`orders/${userId}`);
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
  
  // 특정 제품 정보 가져오기
  app.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const ref = db.ref(`products/${productId}`);
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

// 사용자가 쓴 리뷰 올리고 해당 제품 리뷰 올린거 업데이트
app.post('/reviews', async (req, res) => {
    const { userId, productId, orderId, reviewData } = req.body;
    const reviewKey = db.ref(`reviews/${productId}`).push().key;
    const updates = {};
    updates['reviews/${productId}/${reviewKey}'] = reviewData;
    updates['orders/${userId}/${orderId}/isReviewed'] = 1;
    try {
        await db.ref().update(updates);
        res.status(201).send('Review created successfully and order updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });