import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const PUBLIC_FIREBASE_API_KEY = "AIzaSyAJTIjX0PCcbzWm6SCHwqFFL-iof5rBfTE";
const PUBLIC_FIREBASE_APP_ID = "1:1050273907276:web:47678267ac420760ef2ae9";
const PUBLIC_FIREBASE_AUTH_DOMAIN = "kali-kalihim.firebaseapp.com";
const PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "1050273907276";
const PUBLIC_FIREBASE_PROJECT_ID = "kali-kalihim";
const PUBLIC_FIREBASE_STORAGE_BUCKET = "kali-kalihim.appspot.com";
const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {
  auth as a,
  db as d
};
