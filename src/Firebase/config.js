/*import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAqPdypJ0J8znz5RJNgs1VuZC1AxWFA6aM",
    authDomain: "devgate-b777a.firebaseapp.com",
    projectId: "devgate-b777a",
    storageBucket: "devgate-b777a.firebasestorage.app",
    messagingSenderId: "309433286535",
    appId: "1:309433286535:web:4ca090d84362b7bef21d22"
};

firebase.initializeApp(firebaseConfig);
const app = firebase.firestore();
const auth = firebase.auth();

export { app, auth }; // projectFirestore blast app // projectAuth  */



// src/Firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAqPdypJ0J8znz5RJNgs1VuZC1AxWFA6aM",
    authDomain: "devgate-b777a.firebaseapp.com",
    projectId: "devgate-b777a",
    storageBucket: "devgate-b777a.appspot.com", // small typo fixed here
    messagingSenderId: "309433286535",
    appId: "1:309433286535:web:4ca090d84362b7bef21d22",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };