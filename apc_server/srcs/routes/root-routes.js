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

// Import routers
const storeRouter = require('./storeRouter');
const stockRouter = require('./stockRouter');
const releaseRouter = require('./releaseRouter');
const logisticsRouter = require('./logisticsRouter');

const router = express.Router();

router.use('/store', storeRouter.router);
router.use('/stock', stockRouter.router);
router.use('/release', releaseRouter.router);
router.use('/release', releaseRouter.router);
router.use('/logistics', logisticsRouter.router);


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
