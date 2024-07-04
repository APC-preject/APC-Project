const express = require('express');

const handler = require('../controllers/userController');
const tokenVerify = require('../middleware/token-verify');

const router = express.Router();

// ID 토큰 검증
router.use(tokenVerify.tokenVerify);

// 사용자 정보 받기(내 정보 페이지)
router.get('/:id', handler.getUserInfo);

// 비밀번호 변경
router.post('/passwd/:id', handler.changePasswd);

module.exports = { router };
