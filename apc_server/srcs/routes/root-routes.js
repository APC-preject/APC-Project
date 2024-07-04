const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

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
} = process.env; // 환경변수 가져오기

const authRouter = require('./authRouter');
const ordersRouter = require('./ordersRouter');
const productRouter = require('./productRouter');
const questionsRouter = require('./questionsRouter');
const reviewRouter = require('./reviewRouter');
const userRouter = require('./userRouter');

const router = express.Router();

router.use('/auth', authRouter.router);

router.use('/orders', ordersRouter.router);

router.use('/user', userRouter.router);

router.use('/questions', questionsRouter.router);

router.use('/review', reviewRouter.router);

router.use('/products', productRouter.router);

router.get('/config/firebase', async (req, res) => {
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

module.exports = { router };
