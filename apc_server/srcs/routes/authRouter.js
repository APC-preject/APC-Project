const express = require('express');

const handler = require('../controllers/authController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// 로그인 요청 처리
router.post('/login', handler.login);

// 로그아웃 요청 처리
router.get('/logout', handler.logout);

// 회원가입 처리
router.post('/register', handler.register);

// ID토큰 로그인 검증
router.use(tokenVerify.tokenVerify);

// 로그인 상태 갱신
router.get('/refreshed', handler.refreshed);

module.exports = { router };
