import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0e8r0Z-g-WQY7k7Q8d5EXy8Ayq_hfWMg",
  authDomain: "dine-time-9c15c.firebaseapp.com",
  projectId: "dine-time-9c15c",
  storageBucket: "dine-time-9c15c.firebasestorage.app",
  messagingSenderId: "755442337713",
  appId: "1:755442337713:web:22ab17882f28f5b0105f90",
  measurementId: "G-G0NNDNKVWE",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
