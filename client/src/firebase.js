// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "wera-99736.firebaseapp.com",
  projectId: "wera-99736",
  storageBucket: "wera-99736.appspot.com",
  messagingSenderId: "825364858908",
  appId: "1:825364858908:web:830b7dfd3ff95f42e137d9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
