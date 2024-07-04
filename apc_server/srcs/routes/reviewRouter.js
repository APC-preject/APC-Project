const express = require('express');

const handler = require('../controllers/reviewController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// 상품별 리뷰 정보 가져오기
router.get('/:productId', handler.getProductReview);

// ID 토큰 검증
router.use(tokenVerify.tokenVerify);

// 사용자가 쓴 리뷰 올리고 해당 제품 리뷰 올린거 업데이트
router.post('/', handler.registReview);

module.exports = { router };