import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWTZlIhXqynptxLTXkbOtEzm-8_5jFyww",
  authDomain: "echo-app-dcdad.firebaseapp.com",
  projectId: "echo-app-dcdad",
  storageBucket: "echo-app-dcdad.firebasestorage.app",
  messagingSenderId: "311166202910",
  appId: "1:311166202910:web:5a09f288a85782e2582a0f",
  measurementId: "G-MMZR954BNV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);