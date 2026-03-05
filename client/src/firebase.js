import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAWiyIZ5idAz-7JZtJFmv1gArZjnzsAs9I",
  authDomain: "anjan-crm.firebaseapp.com",
  projectId: "anjan-crm",
  storageBucket: "anjan-crm.firebasestorage.app",
  messagingSenderId: "404263137238",
  appId: "1:404263137238:web:7f0eb9400b75f3ed703e77",
  measurementId: "G-K6R0HRSN5K"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
