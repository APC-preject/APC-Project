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

async function tokenVerify(req, res, next) {
    const jwtToken = req.cookies?.jwtToken; // 쿠키에서 jwtToken 추출
    if (!jwtToken) { // idToken이 없을 시 에러(미인증)
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedjwt = jwt.verify(jwtToken, JWT_SECRET); // jwt 토큰 검증
        req.jwtUserInfo = decodedjwt; // jwt 정보 저장

        const idToken = decodedjwt.idToken; // 토큰에서 idToken 추출
        await admin.auth().verifyIdToken(idToken); // idToken 검증(firebase)
        next(); // 다음 미들웨어(라우터)로 이동
    } catch (error) { // 검증 실패
        if (error.name === 'TokenExpiredError' || error.code === 'auth/id-token-expired') { // jwt expire
            ///// try refresh logic
            try {
                const decodedjwt = jwt.decode(jwtToken);
                const refreshToken = req.cookies?.refreshToken;
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
                    idToken: response.data.idToken,
                    // refreshToken: response.data.refreshToken
                }; // jwt에 담을 정보

                const jwtToken = jwt.sign(jwtInfo, JWT_SECRET, {
                    expiresIn: response.data.expires_in * 1000
                }); // jwt 토큰 생성

                res.cookie('jwtToken', jwtToken, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
                    maxAge: response.data.expires_in * 1000, // session cookie로 만들어 탭 닫으면 쿠키 삭제
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                }); // 쿠키로 jwtToken 전송

                res.cookie('refreshToken', response.data.refreshToken, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // NODE_ENV === 'production', // 프로덕션 환경에서만 secure 플래그 사용(HTTPS only)
                    maxAge: response.data.expires_in * 1000 * 24 * 14,
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                });

                next();
            } catch (error) {
                console.log('Token is invalid:', error);
                res.redirect(401, '/logout');
            }
        } else { // 유효하지 않은 토큰
            console.log('Token is invalid:', error);
            res.redirect(401, '/logout');
        }
    }
}

module.exports = { tokenVerify };
