// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase servislerini başlat
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
