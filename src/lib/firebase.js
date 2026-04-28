// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlGrp5SSwxGG6lfLPPQwn8sj5np2DRm_k",
  authDomain: "vector-339e7.firebaseapp.com",
  projectId: "vector-339e7",
  storageBucket: "vector-339e7.firebasestorage.app",
  messagingSenderId: "952467677740",
  appId: "1:952467677740:web:1c23c9f82ee6c463ed6789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);