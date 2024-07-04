const express = require('express');

const handler = require('../controllers/questionsController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// ID 토큰 검증
router.use(tokenVerify.tokenVerify);

// 전체 문의 리스트 가져오기
router.get('/', handler.getQuestionList);

// 문의 작성
router.post('/', handler.registQuestion);

// 유저 문의 리스트 가져오기
router.get('/user/:userId', handler.userQuestionList);

// 특정 문의 가져오기
router.get('/:questionId', handler.getOneQuestion);

// 문의 답변
router.post('/response/:questionId', handler.registResponse);

module.exports = { router };
