// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase konfigürasyon ayarları
const firebaseConfig = {
  apiKey: "AIzaSyCuHfEjYQzKF-O2DwXUB79vp9gdxIljROE",
  authDomain: "kuaforum-59d7a.firebaseapp.com",
  projectId: "kuaforum-59d7a",
  storageBucket: "kuaforum-59d7a.firebasestorage.app",
  messagingSenderId: "197283498283",
  appId: "1:197283498283:web:46c950bc56d7a0e12b1d6e",
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firebase servislerini başlat
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
