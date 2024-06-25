// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, updatePassword } from "firebase/auth"; 
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDatabase, set, push, ref as databaseRef, get, update, runTransaction, remove, child } from 'firebase/database';
// Todo: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALsiOZq2xgrAiiDgrqBk5S_3Yi6zZ-Lqc",
    authDomain: "unity-apc.firebaseapp.com",
    databaseURL: "https://unity-apc-default-rtdb.firebaseio.com",
    projectId: "unity-apc",
    storageBucket: "unity-apc.appspot.com",
    messagingSenderId: "473072708063",
    appId: "1:473072708063:web:3aa6c318b5dec91585bc6a",
    measurementId: "G-PX7M8PBZFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, analytics, auth, storage, remove, get, storageRef, databaseRef, uploadBytes, getDownloadURL, getDatabase, push, set, update, runTransaction, child, updatePassword, getAuth}

