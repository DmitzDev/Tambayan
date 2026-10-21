import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, Auth, getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

export { app, auth, db };
