const admin = require("firebase-admin")
const adminKey = require('./secrets/unity-apc-firebase-adminsdk.json');

const app = admin.initializeApp({
    databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com',
    credential: admin.credential.cert(adminKey),
    storageBucket: 'unity-apc.appspot.com'
});

const db = admin.database();

module.exports = {
    app, db
};
