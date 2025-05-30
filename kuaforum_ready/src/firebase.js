// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase konfigürasyon ayarları
const firebaseConfig = {
  apiKey: "AIzaSyApRBmnpAJPCK5dAWtCmezOPutry77S2pk",
  authDomain: "kuaforum-71a6e.firebaseapp.com",
  projectId: "kuaforum-71a6e",
  storageBucket: "kuaforum-71a6e.firebasestorage.app",
  messagingSenderId: "479564395884",
  appId: "1:479564395884:web:336aaa52745ec11cb7af49",
  measurementId: "G-91VSZW78N3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);