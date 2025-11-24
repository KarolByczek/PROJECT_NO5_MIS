import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const UNiFirebaseConfig = {
  apiKey: "AIzaSyBot1Pm4l2fWWRbduRIrdRrQCPrN3H5hZQ",
  authDomain: "uniformism-entries.firebaseapp.com",
  projectId: "uniformism-entries",
  storageBucket: "uniformism-entries.firebasestorage.app",
  messagingSenderId: "645196019346",
  appId: "1:645196019346:web:0b8a1e14fa00eed1cd984b",
  measurementId: "G-3DMNC1BYCS"
};

// Initialize the second Firebase app with a custom name
const UNiApp = getApps().find(app => app.name === "UNiConf")
  ? getApp("UNiConf")
  : initializeApp(UNiFirebaseConfig, "UNiConf");

const UniformismDb = getFirestore(UNiApp);

export { UNiApp, UniformismDb }