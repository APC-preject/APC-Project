const axios = require('axios');
const jwt = require('jsonwebtoken');
const firebase = require('../../firebase');
const dotenv = require('dotenv');

dotenv.config({ path: './secrets/.env' }); // .env 파일에서 환경변수 로드

const db = firebase.db;

const {
    API_KEY,
    JWT_SECRET
} = process.env; // 환경변수 가져오기

async function login(req, res) {
    const { email, password } = req.body;
    // firebase rest api를 이용한 로그인
    const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

    try {
        const response = await axios.post(FIREBASE_AUTH_URL, {
            email,
            password,
            returnSecureToken: true
        }); // firebase auth 서버에 로그인 요청
        if (response.data.error) {
            throw new Error('Invalid email or password');
        } // 로그인 실패 시 에러 발생

        const idToken = response.data.idToken; // idToken 추출
        const refreshToken = response.data.refreshToken; // refreshToken 추출

        const userId = email.replace(".", "_");
        const snapshot = await db.ref(`users/${userId}/role`).get(); // db에서 유저의 role 가져오기
        if (snapshot.exists()) { // 유저 정보가 있을 시
            const loggedInUserRole = snapshot.val();
            const jwtInfo = {
                userId: userId,
                role: loggedInUserRole,
                idToken: idToken
            }; // jwt에 담을 정보

            const jwtToken = jwt.sign(jwtInfo, JWT_SECRET, {
                expiresIn: response.data.expiresIn * 1000
            }); // jwt 토큰 생성

            res.cookie('jwtToken', jwtToken, {
                httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                secure: true, // HTTPS only
                maxAge: response.data.expiresIn * 1000 * 24 * 14,
                sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
            }); // 쿠키로 jwtToken 전송

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // http 프로토콜로만 쿠키 접근 가능(자바스크립트로 접근 불가, 보안 강화)
                secure: true, // HTTPS only
                maxAge: response.data.expiresIn * 1000 * 24 * 14,
                sameSite: 'none' // sameSite가 none이면 secure가 true여야 함
            }); // 쿠키로 refreshToken 전송

            res.status(200).json({ // 로그인 성공 시
                userId: userId,
                loggedInUserRole: loggedInUserRole
            }); // role과 userId 전송(로그인 성공)
        } else {
            res.status(404).json({ message: 'User not found' }); // 유저 정보 없을 시 에러
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid email or password' }); // 로그인 실패 시 에러
    }
}

async function logout(req, res) {
    res.clearCookie('jwtToken'); // 쿠키 토큰 삭제
    res.clearCookie('refreshToken'); // 쿠키 토큰 삭제
    res.redirect('/user/login'); // 로그인 창으로 이동
    return ;
}

const available_apc_token = 'espresso1234';

async function register(req, res) {
    const {
        email, password, name, role, apcID, apcToken
    } = req.body; // 요청 바디에서 이메일, 비밀번호, 이름, role, apcID 추출
    // firebase rest api를 이용한 회원가입
    if (apcToken !== available_apc_token) {
        res.status(401).json({ message: 'unavailable apcToken' });
        return ;
    }
    const FIREBASE_AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    try {
        const response = await axios.post(FIREBASE_AUTH_URL, {
            email,
            password,
            returnSecureToken: true
        }); // firebase auth 서버에 회원가입 요청
        if (response.data.error) { // 회원가입 실패 시 에러 발생
            throw new Error('Register failed');
        }
        const uid = response.data.localId; // uid 추출
        const userData = {
            email: email,
            name: name,
            password: password,
            uid: uid,
            role: role
        }; // 유저 데이터 생성
        if (role === 1) { // 판매자인 경우 apcId와 online 여부 항목 추가
            userData['apcID'] = apcID;
            userData['online'] = 0;
        }

        const userId = email.replace(".", "_");
        const userRef = db.ref();
        const updates = {};
        updates[`users/${userId}`] = userData;
        await userRef.update(updates); // db에 유저 데이터 저장

        res.status(200).json({ message: '회원가입 성공' });
    } catch (error) { // 회원가입 실패 시 에러 처리
        console.error('Error creating user: ', error);
        res.status(500).json({ message: '회원가입 실패', error });
    }
}

// 해당 함수를 호출하면 jwt 토큰을 이용해 로그인한 유저의 정보를 반환, 이를 통해 로그인 상태를 유지
async function refreshed(req, res) {
    res.status(200).json({
        userId: req.jwtUserInfo.userId,
        loggedInUserRole: req.jwtUserInfo.role
    });
}

module.exports = {
    login, logout, register, refreshed
}
