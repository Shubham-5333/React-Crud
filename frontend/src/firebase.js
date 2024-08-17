// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCctke12I3Nxc_-NL7gyGlxWGIkDqQil2k",
  authDomain: "crud-re-d8e8e.firebaseapp.com",
  projectId: "crud-re-d8e8e",
  storageBucket: "crud-re-d8e8e.appspot.com",
  messagingSenderId: "992330452796",
  appId: "1:992330452796:web:3ae929aeafc16d56401839"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };