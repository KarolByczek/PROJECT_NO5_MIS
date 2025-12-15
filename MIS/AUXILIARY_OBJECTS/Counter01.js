import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const Counter01FirebaseConfig = {
  apiKey: "AIzaSyDHr4iMg3HYJuWkODHczfqR4lPAZuYr5hI",
  authDomain: "portrait-data.firebaseapp.com",
  projectId: "portrait-data",
  storageBucket: "portrait-data.firebasestorage.app",
  messagingSenderId: "78857993195",
  appId: "1:78857993195:web:d8e45b29f28b2b3019b7ae",
  measurementId: "G-7X993G10RH"
  };


// Create or retrieve a NAMED SECONDARY app
const counter01App =
  getApps().find(app => app.name === "counter01") ||
  initializeApp(Counter01FirebaseConfig, "counter01");

// Get Firestore instance of this SECONDARY app
const counter01Db = getFirestore(counter01App);

export { counter01App, counter01Db };