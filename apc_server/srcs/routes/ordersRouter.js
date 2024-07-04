const express = require('express');

const handler = require('../controllers/ordersController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// ID토큰 로그인 검증
router.use(tokenVerify.tokenVerify);

// 주문 요청 처리
router.post('/', handler.makeOrder);

// 배송 시작 요청 처리
router.post('/go/:id/:orderid', handler.deliveryStart);

// 배송 완료 요청 처리
router.post('/arrive/:id/:orderid', handler.deliveryComplete);

// 배송 대기 목록 요청
router.get('/deliveryWaits/:providerId', handler.deliveryWaitsList);

// 특정 유저의 주문 목록 요청
router.get('/:id', handler.getUserOrder);

// 특정 주문의 상세 정보 요청
router.get('/:id/:orderid', handler.getOneOrder);


module.exports = { router };
