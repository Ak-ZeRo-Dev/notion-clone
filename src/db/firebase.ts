import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIRE_STORE_API_KEY,
  authDomain: process.env.FIRE_STORE_AUTH_DOMAIN,
  projectId: process.env.FIRE_STORE_PROJECT_ID,
  storageBucket: process.env.FIRE_STORE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRE_STORE_MESSAGING_SENDER_ID,
  appId: process.env.FIRE_STORE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
