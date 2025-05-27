// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuHfEjYQzKF-O2DwXUB79vp9gdxIljROE",
  authDomain: "kuaforum-59d7a.firebaseapp.com",
  databaseURL: "https://kuaforum-59d7a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kuaforum-59d7a",
  storageBucket: "kuaforum-59d7a.firebasestorage.app",
  messagingSenderId: "197283498283",
  appId: "1:197283498283:web:46c950bc56d7a0e12b1d6e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
