import * as admin from "firebase-admin";
import { getAnalytics } from "firebase/analytics";
import { getAuth, updatePassword } from "firebase/auth"; 
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, set, push, ref as databaseRef, get, update, runTransaction, remove, child } from 'firebase/database';
import adminKey from './secrets/unity-apc-firebase-adminsdk.json';

const app = admin.initializeApp({
    databaseURL: 'https://unity-apc-default-rtdb.firebaseio.com',
    credential: admin.credential.cert(adminKey),
    storageBucket: 'unity-apc.appspot.com'
});
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, analytics, auth, storage, remove, get, storageRef, databaseRef, uploadBytes, getDownloadURL, getDatabase, push, set, update, runTransaction, child, updatePassword, getAuth}