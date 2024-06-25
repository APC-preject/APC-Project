const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const adminKey = require('./unity-apc-firebase-adminsdk.json');
const multer = require('multer');

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
