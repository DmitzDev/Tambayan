import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post, Story, ChatMessage, ReactionType, UserAccount, CommentItem } from '../types';

export class RealtimeService {
  // 1. Subscribe to Live Posts
  static subscribePosts(callback: (posts: Post[]) => void): Unsubscribe {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        const posts: Post[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          posts.push({
            id: docSnap.id,
            authorId: data.authorId || '',
            authorName: data.authorName || 'Student',
            authorAvatar: data.authorAvatar || '/images/app_icon.webp',
            content: data.content || '',
            imageWebP: data.imageWebP || null,
            privacy: data.privacy || 'Public',
            tags: data.tags || [],
            createdAt: data.createdAt || Date.now(),
            reactions: data.reactions || {
              like: 0,
              love: 0,
              haha: 0,
              wow: 0,
              sad: 0,
              angry: 0,
            },
            userReactions: data.userReactions || {},
            comments: data.comments || [],
          });
        });
        callback(posts);
      },
      (err) => {
        console.warn('Realtime posts subscription fallback:', err);
      }
    );
  }

  // 2. Publish New Post
  static async createPost(
    user: UserAccount,
    content: string,
    imageWebP?: string | null,
    privacy: 'Public' | 'Friends' | 'Only me' = 'Public',
    tags: string[] = []
  ): Promise<string> {
    const postData = {
      authorId: user.uid,
      authorName: user.displayName || 'Tambayan User',
      authorAvatar: user.avatar || '/images/app_icon.webp',
      content,
      imageWebP: imageWebP || null,
      privacy,
      tags,
      createdAt: Date.now(),
      reactions: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0,
      },
      userReactions: {},
      comments: [],
    };

    const docRef = await addDoc(collection(db, 'posts'), postData);
    return docRef.id;
  }

  // 3. Facebook Reactions Toggle (Like, Love, Haha, Wow, Sad, Angry)
  static async toggleReaction(
    postId: string,
    userId: string,
    chosenReaction: ReactionType,
    currentPost: Post
  ): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const existingReaction = currentPost.userReactions[userId];
    const newReactions = { ...currentPost.reactions };
    const newUserReactions = { ...currentPost.userReactions };

    // If user clicked the same reaction, remove it
    if (existingReaction === chosenReaction) {
      newReactions[existingReaction] = Math.max(0, (newReactions[existingReaction] || 1) - 1);
      delete newUserReactions[userId];
    } else {
      // If user had a different reaction previously, decrement it
      if (existingReaction) {
        newReactions[existingReaction] = Math.max(0, (newReactions[existingReaction] || 1) - 1);
      }
      // Increment new reaction
      newReactions[chosenReaction] = (newReactions[chosenReaction] || 0) + 1;
      newUserReactions[userId] = chosenReaction;
    }

    await updateDoc(postRef, {
      reactions: newReactions,
      userReactions: newUserReactions,
    });
  }

  // 4. Threaded Comments
  static async addComment(
    postId: string,
    user: UserAccount,
    content: string,
    currentComments: CommentItem[],
    parentId?: string | null
  ): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const newComment: CommentItem = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: user.uid,
      authorName: user.displayName,
      authorAvatar: user.avatar,
      content,
      createdAt: Date.now(),
      parentId: parentId || null,
    };

    const updatedComments = [...currentComments, newComment];
    await updateDoc(postRef, {
      comments: updatedComments,
    });
  }

  // 5. Facebook 24-Hour Stories
  static subscribeStories(callback: (stories: Story[]) => void): Unsubscribe {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(20));
    return onSnapshot(
      q,
      (snapshot) => {
        const stories: Story[] = [];
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.createdAt && data.createdAt > oneDayAgo) {
            stories.push({
              id: docSnap.id,
              authorId: data.authorId,
              authorName: data.authorName,
              authorAvatar: data.authorAvatar,
              imageWebP: data.imageWebP,
              caption: data.caption,
              createdAt: data.createdAt,
            });
          }
        });
        callback(stories);
      },
      (err) => console.warn('Stories listener fallback:', err)
    );
  }

  static async createStory(user: UserAccount, imageWebP: string, caption?: string): Promise<string> {
    const storyData = {
      authorId: user.uid,
      authorName: user.displayName,
      authorAvatar: user.avatar,
      imageWebP,
      caption: caption || '',
      createdAt: Date.now(),
    };
    const docRef = await addDoc(collection(db, 'stories'), storyData);
    return docRef.id;
  }

  // 6. Messenger Floating Chat Stream
  static subscribeMessages(roomId: string, callback: (msgs: ChatMessage[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'chat_rooms', roomId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          msgs.push({
            id: docSnap.id,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            text: data.text,
            createdAt: data.createdAt,
          });
        });
        callback(msgs);
      },
      (err) => console.warn('Chat listener fallback:', err)
    );
  }

  static async sendMessage(roomId: string, user: UserAccount, text: string): Promise<void> {
    await addDoc(collection(db, 'chat_rooms', roomId, 'messages'), {
      senderId: user.uid,
      senderName: user.displayName,
      senderAvatar: user.avatar,
      text,
      createdAt: Date.now(),
    });
  }
}
