// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAzMxDubXdBaS78XX4Ag6LSPrpVXNVGc0",
  authDomain: "ai-notion-9a89b.firebaseapp.com",
  projectId: "ai-notion-9a89b",
  storageBucket: "ai-notion-9a89b.firebasestorage.app",
  messagingSenderId: "498457713479",
  appId: "1:498457713479:web:7429c90331bdb0fd9c8a62",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
