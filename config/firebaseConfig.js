// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0e8r0Z-g-WQY7k7Q8d5EXy8Ayq_hfWMg",
  authDomain: "dine-time-9c15c.firebaseapp.com",
  projectId: "dine-time-9c15c",
  storageBucket: "dine-time-9c15c.firebasestorage.app",
  messagingSenderId: "755442337713",
  appId: "1:755442337713:web:22ab17882f28f5b0105f90",
  measurementId: "G-G0NNDNKVWE",
};

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase initialized successfully!");
  console.log("🔥 Firestore DB:", db ? "Ready" : "Not ready");
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
