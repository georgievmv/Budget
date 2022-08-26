import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHPcV1dnWoWos0zJWAq4UYkAaGPz7BIwg",
  authDomain: "auth-test-905ba.firebaseapp.com",
  projectId: "auth-test-905ba",
  storageBucket: "auth-test-905ba.appspot.com",
  messagingSenderId: "891853684126",
  appId: "1:891853684126:web:de416ec7dba88ac6e8ea8f",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
