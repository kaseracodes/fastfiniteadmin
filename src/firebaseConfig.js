import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAM21ipI9MXcAv9AFQXZYheBPww7jqzi48",
  authDomain: "fastfinite-bike-rental.firebaseapp.com",
  projectId: "fastfinite-bike-rental",
  storageBucket: "fastfinite-bike-rental.appspot.com",
  messagingSenderId: "349020641736",
  appId: "1:349020641736:web:6485a37a255d9158de48fd",
  measurementId: "G-4V23PHP2BL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
