// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyColSU4_gEGgZ2vj7QuzQ9ELV3wpBbOC20",
  authDomain: "btmusic-bcit.firebaseapp.com",
  projectId: "btmusic-bcit",
  storageBucket: "btmusic-bcit.appspot.com",
  messagingSenderId: "102844144043",
  appId: "1:102844144043:web:df85ce4e62b7c514079aee",
  measurementId: "G-9MQYCK5JBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
