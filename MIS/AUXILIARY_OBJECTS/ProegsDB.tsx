import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const ProEgFirebaseConfig = {
  apiKey: "AIzaSyAwROrWuEbtxFGIoHU5ABsseqz8vWeMFVU",
  authDomain: "proegs-entries.firebaseapp.com",
  projectId: "proegs-entries",
  storageBucket: "proegs-entries.firebasestorage.app",
  messagingSenderId: "465814528430",
  appId: "1:465814528430:web:6de3c025700493214be83f",
  measurementId: "G-W4TTZVMRYJ"
};

// Initialize the second Firebase app with a custom name
const ProEgsApp = getApps().find(app => app.name === "ProEgConf")
  ? getApp("ProEgConf")
  : initializeApp(ProEgFirebaseConfig, "ProEgConf");

const ProEgsDb = getFirestore(ProEgsApp);

export { ProEgsApp, ProEgsDb }