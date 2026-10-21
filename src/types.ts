export interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  tags?: string[];
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  repostsCount: number;
  privacy: 'Public' | 'Friends' | 'Only me';
  isPinned?: boolean;
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
