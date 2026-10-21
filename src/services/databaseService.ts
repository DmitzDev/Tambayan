import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  DocumentData,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export interface FeedPost {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string | null;
  content: string;
  image_data?: string | null;
  privacy: 'Public' | 'Friends' | 'Only me' | string;
  created_at?: any;
  likes_count: number;
  comments_count: number;
}

export class DatabaseService {
  // Update Profile Picture as Base64 and publish automated Feed Post
  static async updateProfilePicture(base64Image: string, privacySetting: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const mimeType = base64Image.startsWith('data:')
      ? base64Image
      : `data:image/jpeg;base64,${base64Image}`;

    // 1. Update user profile document
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      profile_picture: mimeType,
    });

    // 2. Create automated Feed post
    await addDoc(collection(db, 'posts'), {
      user_id: user.uid,
      author_name: user.displayName || 'Unknown',
      author_avatar: mimeType,
      content: 'Updated their profile picture.',
      image_data: mimeType,
      privacy: privacySetting,
      created_at: serverTimestamp(),
      likes_count: 0,
      comments_count: 0,
    });
  }

  // Create a new custom feed post
  static async createPost(content: string, imageData?: string | null, privacy = 'Public'): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    await addDoc(collection(db, 'posts'), {
      user_id: user.uid,
      author_name: user.displayName || 'User',
      author_avatar: user.photoURL || null,
      content,
      image_data: imageData || null,
      privacy,
      created_at: serverTimestamp(),
      likes_count: 0,
      comments_count: 0,
    });
  }

  // Subscribe to User Profile Data
  static subscribeUserProfile(uid: string, onUpdate: (data: DocumentData | null) => void): Unsubscribe {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate({ id: snapshot.id, ...snapshot.data() });
      } else {
        onUpdate(null);
      }
    });
  }

  // Subscribe to Feed Posts
  static subscribeFeedPosts(onUpdate: (posts: FeedPost[]) => void): Unsubscribe {
    const q = query(collection(db, 'posts'), orderBy('created_at', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts: FeedPost[] = [];
      snapshot.forEach((docSnap) => {
        posts.push({ id: docSnap.id, ...(docSnap.data() as Omit<FeedPost, 'id'>) });
      });
      onUpdate(posts);
    });
  }
}
