// src/Firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//     apiKey: "AIzaSyAqPdypJ0J8znz5RJNgs1VuZC1AxWFA6aM",
//     authDomain: "devgate-b777a.firebaseapp.com",
//     projectId: "devgate-b777a",
//     storageBucket: "devgate-b777a.firebasestorage.app",
//     messagingSenderId: "309433286535",
//     appId: "1:309433286535:web:4ca090d84362b7bef21d22"
// };

const firebaseConfig = {
    apiKey: "AIzaSyBbzbhC9BzycDV7MOAHZbeUTQHtdkiMqCg",
    authDomain: "devgate-app.firebaseapp.com",
    projectId: "devgate-app",
    storageBucket: "devgate-app.firebasestorage.app",
    messagingSenderId: "1057204004887",
    appId: "1:1057204004887:web:86b54fa8a9ebb04492d452"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Init services
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, app }; // I added 'app' as it is needed for deleteobjective.Js