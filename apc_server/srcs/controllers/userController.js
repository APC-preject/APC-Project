const axios = require('axios');
const jwt = require('jsonwebtoken');
const firebase = require('../../firebase');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

const db = firebase.db; // firebase database 초기화

const {
    // firebase config
    API_KEY,
    JWT_SECRET
} = process.env; // 환경변수 가져오기

async function getUserInfo(req, res) {
    const userId = req.params.id; // userId 파라미터 추출
    const userRef = db.ref(`users/${userId}`); // 사용자 정보 레퍼런스
    userRef.once('value', snapshot => { // 사용자 정보 가져오기
        if (snapshot.exists()) { // 사용자 정보가 있을 시
            res.json(snapshot.val());
        } else { // 사용자 정보가 없을 시
            res.status(404).send('User not found');
        }
    }, error => { // 사용자 정보 가져오기 실패 시
        res.status(500).send('Error getting user data:', error);
    });
}

async function changePasswd(req, res) {
    const userId = req.params.id; // userId 파라미터 추출
    const { currentPassword, newPassword } = req.body; // currentPassword, newPassword 추출
    const idToken = req.jwtUserInfo.idToken; // 쿠키에서 idToken 추출

    // firebase rest api를 이용한 비밀번호 변경
    const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;

    try {
        const response = await axios.post(FIREBASE_AUTH_URL, { // firebase auth 서버에 비밀번호 변경 요청
            idToken: idToken,
            password: newPassword,
            returnSecureToken: true
        });
        if (response.data.error) { // 비밀번호 변경 실패 시
            throw new Error('Error updating password');
        }
        const newidToken = response.data.idToken; // 새로운 idToken 추출
        const newRefreshToken = response.data.refreshToken; // 새로운 refreshToken 추출

        const jwtInfo = {
            userId: req.jwtUserInfo.userId,
            role: req.jwtUserInfo.role,
            idToken: newidToken
        }; // jwt에 담을 정보

        const jwtToken = jwt.sign(jwtInfo, JWT_SECRET, {
            expiresIn: response.data.expiresIn * 1000
        }); // jwt 토큰 생성

        const userRef = db.ref(`users/${userId}`); // 사용자 정보 레퍼런스
        userRef.child('password').once('value', async (snapshot) => { // 사용자 비밀번호 가져오기
            const storedPassword = snapshot.val(); // 저장된 비밀번호 추출
            if (storedPassword === currentPassword) { // 현재 비밀번호가 일치할 시
                await userRef.child('password').set(newPassword); // 새로운 비밀번호로 업데이트

                res.cookie('jwtToken', jwtToken, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // HTTPS only
                    maxAge: response.data.expiresIn * 1000, 
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                }); // 쿠키로 새로운 idToken 전송(비밀번호 변경 성공)

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                    secure: true, // HTTPS only
                    maxAge: response.data.expiresIn * 1000 * 24 * 14,
                    sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
                }); // 쿠키로 새로운 refreshToken 전송(비밀번호 변경 성공)

                res.status(200).send('Password updated successfully');
            } else { // 현재 비밀번호가 일치하지 않을 시
                console.log('Current password does not match'); // 에러 출력
                res.status(400).send('Current password does not match');
            }
        }, error => { // 사용자 비밀번호 가져오기 실패 시
            console.log('Error updating password:');
            res.status(500).send('Error updating password:');
        });
    } catch (error) { // 비밀번호 변경 실패 시
        console.log('Error updating password:');
        res.status(500).send('Error updating password');
        return;
    }
}

module.exports = {
    getUserInfo, changePasswd
};
