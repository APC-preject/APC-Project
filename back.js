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
const port = 4000;

app.use(cors());
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
