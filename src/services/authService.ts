import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface UserProfileData {
  uid: string;
  name: string;
  email: string;
  profile_picture?: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at?: any;
}

export class AuthService {
  static get currentUser(): User | null {
    return auth.currentUser;
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static async signUpWithEmail(name: string, email: string, pass: string): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;

    if (user) {
      await updateProfile(user, { displayName: name });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        name,
        email,
        profile_picture: null,
        created_at: serverTimestamp(),
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      });
    }

    return cred;
  }

  static async signInWithEmail(email: string, pass: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, pass);
  }

  static async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
