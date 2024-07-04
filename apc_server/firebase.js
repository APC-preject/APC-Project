const admin = require("firebase-admin")
const adminKey = require('./secrets/unity-apc-firebase-adminsdk.json');

const app = admin.initializeApp({
    databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com',
    credential: admin.credential.cert(adminKey),
    storageBucket: 'unity-apc.appspot.com'
}); // 파이어베이스 앱 초기화

const db = admin.database(); // 파이어베이스 데이터베이스 초기화

module.exports = {
    app, db
}; // 외부에서 사용할 수 있도록 export
