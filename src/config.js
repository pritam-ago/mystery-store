import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3MeSMob8MEPiB5IpYma8EH9BCKjqg3js",
  authDomain: "mystery-store-3f36c.firebaseapp.com",
  projectId: "mystery-store-3f36c",
  storageBucket: "mystery-store-3f36c.appspot.com",
  messagingSenderId: "1029007590775",
  appId: "1:1029007590775:web:1ecc612dff683eeec7cd72"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};