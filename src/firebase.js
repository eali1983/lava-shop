// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqCPoeVT3VQNtRtY8mVJ2upHdAQZMD1Ck",
  authDomain: "lava-shop-91c3b.firebaseapp.com",
  projectId: "lava-shop-91c3b",
  storageBucket: "lava-shop-91c3b.firebasestorage.app",
  messagingSenderId: "126528909444",
  appId: "1:126528909444:web:0a1764a7c167590ea9d2d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export the Firestore instance
const db = getFirestore(app);
export { db };

