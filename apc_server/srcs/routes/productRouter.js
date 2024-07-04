const express = require('express');
const multer = require('multer');
const multstorage = multer.memoryStorage(); // multer 스토리지 설정
const upload = multer({ storage: multstorage }); // multer 업로드 설정

const handler = require('../controllers/productController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// 상품 목록 가져오기
router.get('/', handler.getProductList);

// 상품 정보 가져오기
router.get('/:productId', handler.getProductInfo);

// ID 토큰 검증
router.use(tokenVerify.tokenVerify);

// 상품 등록
router.post('/', handler.registProduct);

// 상품 이미지 업로드
router.post('/image/:name', upload.single('image'), handler.storeProductImage);

// 해당 유저가 판매자인지 확인
router.get('/user/:userId', handler.isProvideProduct);

// 판매자 판매 품목 추가
router.post('/user/:userId', handler.addProvideProduct);

module.exports = { router };
