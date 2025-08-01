import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD8VZHrkla7RvZ5ZrtbXx6r1N2KQOozUcQ",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "moments-425c9",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Firebase 서비스들을 export
export { auth, db, storage };

// 기본 export로 auth 제공 (기존 코드와의 호환성을 위해)
export default auth;
