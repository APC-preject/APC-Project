const admin = require('firebase-admin');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

const firebase = require('../../firebase');

const {
    // firebase config
    API_KEY,
    JWT_SECRET
} = process.env; // 환경변수 가져오기

const db = firebase.db; // firebase database 초기화

// 토큰 검증 미들웨어
async function tokenVerify(req, res, next) {
    const jwtToken = req.cookies?.jwtToken; // 쿠키에서 jwtToken 추출
    if (!jwtToken) { // jwtToken이 없을 시 에러(미인증)
        console.log('unauthorized');
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedjwt = jwt.verify(jwtToken, JWT_SECRET); // jwt 토큰 검증
        req.jwtUserInfo = {
            userId: decodedjwt.userId,
            role: decodedjwt.role
        }; // jwt 정보 저장

        const idToken = decodedjwt.idToken; // 토큰에서 idToken 추출
        await admin.auth().verifyIdToken(idToken); // idToken 검증(firebase 사용)
        next(); // 다음 미들웨어(라우터)로 이동
    } catch (error) { // 검증 실패
        console.log('fail');
        console.log(error);
        if (error.name === 'TokenExpiredError' || error.code === 'auth/id-token-expired' || error.message === 'debug/id-token-expired') { // jwt토큰 만료 시
            // try refresh logic
            try {
                console.log('Token is expired. Try to refresh token.');
                const decodedjwt = jwt.decode(jwtToken); // jwt 토큰 디코딩(검증 절차 없음)
                const refreshToken = req.cookies?.refreshToken; // 쿠키에서 refreshToken 추출
                if (!refreshToken) { // refreshToken이 없을 시 에러(미인증)
                    throw new Error("unauthorized");
                }

                const FIREBASE_AUTH_URL = `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`;
                const response = await axios.post(FIREBASE_AUTH_URL, {
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                });
                if (response.data.error) {
                    throw new Error("unauthorized");
                }

                const jwtInfo = {
                    userId: decodedjwt.userId,
                    role: decodedjwt.role,
                    idToken: response.data.id_token
                }; // jwt에 담을 정보

                const newjwtToken = jwt.sign(jwtInfo, JWT_SECRET, {
                    expiresIn: response.data.expires_in * 1000
                }); // jwt 토큰 생성

                res.cookie('jwtToken', newjwtToken, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // HTTPS only
                    maxAge: response.data.expires_in * 1000 * 24 * 14,
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                }); // 쿠키로 jwtToken 전송

                res.cookie('refreshToken', response.data.refresh_token, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // HTTPS only
                    maxAge: response.data.expires_in * 1000 * 24 * 14,
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                });

                req.jwtUserInfo = {
                    userId: decodedjwt.userId,
                    role: decodedjwt.role
                };

                next();
            } catch (error) { // 토큰 갱신 실패
                console.log('Token is invalid1:', error);
                res.redirect(401, '/logout');
            }
        } else { // 유효하지 않은 토큰
            console.log('Token is invalid2:', error);
            res.redirect(401, '/logout');
        }
    }
}

module.exports = { tokenVerify };
