// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmRYSPmFJb_wbJKVdkIf6LEVao2NyaiTg",
  authDomain: "todo-app-74852.firebaseapp.com",
  projectId: "todo-app-74852",
  storageBucket: "todo-app-74852.firebasestorage.app",
  messagingSenderId: "316322627894",
  appId: "1:316322627894:web:2b7b8b71b9665fb1a07397",
  measurementId: "G-CBW05WE1SE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app)