// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID),
};

const dbUrl = import.meta.env.VITE_FIREBASE_REGION
  ? `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.${import.meta.env.VITE_FIREBASE_REGION}.firebasedatabase.app`
  : undefined

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const realtimeDB = getDatabase(app, dbUrl);
