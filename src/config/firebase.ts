import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCSh1reRw0yDE_Oj4PXSnyblzI1WT4kMD0',
  authDomain: 'tambayan-dev.firebaseapp.com',
  projectId: 'tambayan-dev',
  storageBucket: 'tambayan-dev.firebasestorage.app',
  messagingSenderId: '1077182673507',
  appId: '1:1077182673507:web:470ea43460b29e76883e56',
  measurementId: 'G-M1FQKK4SNQ',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
