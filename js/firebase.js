import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXD_1ecyYdl7pM9mf_Cvfk0vLwEq1LSSs",
  authDomain: "socorroteen-login.firebaseapp.com",
  projectId: "socorroteen-login",
  storageBucket: "socorroteen-login.firebasestorage.app",
  messagingSenderId: "848590445384",
  appId: "1:848590445384:web:dfad25be7c0b2cb079b17d",
  measurementId: "G-BC0FDB4SLH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
