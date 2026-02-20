"use client";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments

const firebaseConfig = {
  apiKey: "AIzaSyCa4oxyx0fVATJEz8E0JpX0IFIBjXMYFKg",
  authDomain: "james-battletech-tools.firebaseapp.com",
  projectId: "james-battletech-tools",
  storageBucket: "james-battletech-tools.firebasestorage.app",
  messagingSenderId: "532949047230",
  appId: "1:532949047230:web:17bb1c65dac2e0b3d9cbef"
};

export const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
}
