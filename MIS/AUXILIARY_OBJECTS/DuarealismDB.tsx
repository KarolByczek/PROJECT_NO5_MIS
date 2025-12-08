import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";



const DRFirebaseConfig = {
  apiKey: "AIzaSyBsflnoDdBulB4w9KJf2fO1buebBDHLt54",
  authDomain: "duarealism-entries.firebaseapp.com",
  projectId: "duarealism-entries",
  storageBucket: "duarealism-entries.firebasestorage.app",
  messagingSenderId: "562470942726",
  appId: "1:562470942726:web:e45eab4f294c2e845eeb87",
  measurementId: "G-RH3NTNPTRP"
};

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    signInAnonymously(auth);
  }
});

// Initialize the second Firebase app with a custom name
const DRApp = getApps().find(app => app.name === "DRConf")
  ? getApp("DRConf")
  : initializeApp(DRFirebaseConfig, "DRConf");

const DuarealismDb = getFirestore(DRApp);

export { DRApp, DuarealismDb };