// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdijC--1-P7Vh7CBlrQu4RoQ9S-c-ZjVU",
  authDomain: "ai-notion-fd6c5.firebaseapp.com",
  projectId: "ai-notion-fd6c5",
  storageBucket: "ai-notion-fd6c5.firebasestorage.app",
  messagingSenderId: "975634536108",
  appId: "1:975634536108:web:31f750d748960247307109",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
