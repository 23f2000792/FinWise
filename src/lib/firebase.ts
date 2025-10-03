import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPg76PjNHSkbIXJvvH60Jizf9Uj0Ga-MQ",
  authDomain: "studio-266246095-ff904.firebaseapp.com",
  projectId: "studio-266246095-ff904",
  storageBucket: "studio-266246095-ff904.appspot.com",
  messagingSenderId: "1030830193167",
  appId: "1:1030830193167:web:69c24c4b2d2f4898e0017a",
  measurementId: ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
