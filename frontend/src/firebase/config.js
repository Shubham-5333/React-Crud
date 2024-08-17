import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCctke12I3Nxc_-NL7gyGlxWGIkDqQil2k",
  authDomain: "crud-re-d8e8e.firebaseapp.com",
  projectId: "crud-re-d8e8e",
  storageBucket: "crud-re-d8e8e.appspot.com",
  messagingSenderId: "992330452796",
  appId: "1:992330452796:web:3ae929aeafc16d56401839"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };