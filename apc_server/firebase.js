const admin = require("firebase-admin")
const dotenv = require('dotenv');

dotenv.config({ path: './.env' }); // .env 파일에서 환경변수 로드
const { FIREBASE_ADMIN_SDK } = process.env; // 환경변수 가져오기
const adminKey = require(FIREBASE_ADMIN_SDK);

const app = admin.initializeApp({
    databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com',
    credential: admin.credential.cert(adminKey),
    storageBucket: 'unity-apc.appspot.com'
}); // 파이어베이스 앱 초기화

const db = admin.database(); // 파이어베이스 데이터베이스 초기화

module.exports = {
    app, db
}; // 외부에서 사용할 수 있도록 export
