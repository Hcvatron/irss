import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBwjDuTvVQKN9tJMn960e7e9Q3NPxSPNMQ",
  authDomain: "ibsgovv.firebaseapp.com",
  projectId: "ibsgovv",
  storageBucket: "ibsgovv.appspot.com",
  messagingSenderId: "733815470319",
  appId: "1:733815470319:web:781763656ce51fd3cd031a",
  measurementId: "G-37BDYH4S2S"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
