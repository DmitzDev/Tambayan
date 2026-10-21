export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';

export interface CommentItem {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: number;
  parentId?: string | null;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  imageWebP?: string | null;
  privacy: 'Public' | 'Friends' | 'Only me';
  tags: string[];
  createdAt: number;
  reactions: Record<ReactionType, number>;
  userReactions: Record<string, ReactionType>; // userId -> ReactionType
  comments: CommentItem[];
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  imageWebP: string;
  caption?: string;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: number;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  bio?: string;
  campus?: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  coverImage: string;
  bio: string;
  campus: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface Hangout {
  id: string;
  title: string;
  subtitle: string;
  activeCount: number;
  image: string;
  category: string;
  isJoined?: boolean;
  hostName: string;
}

export interface Community {
  id: string;
  name: string;
  membersCount: string;
  image: string;
  tag: string;
  color: string;
  description: string;
  isMember?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'mention' | 'tag' | 'chat';
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  target?: string;
  previewImage?: string;
  read?: boolean;
}

export interface LocalProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  isConnected?: boolean;
  bio: string;
}
