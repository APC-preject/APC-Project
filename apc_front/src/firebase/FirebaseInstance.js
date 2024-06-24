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
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, analytics, auth, storage, remove, get, storageRef, databaseRef, uploadBytes, getDownloadURL, getDatabase, push, set, update, runTransaction, child, updatePassword, getAuth}

