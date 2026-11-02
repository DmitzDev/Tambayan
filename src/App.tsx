import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { RealtimeService } from './services/realtimeService';
import {
  Post,
  Story,
  UserAccount,
  ReactionType,
  Community,
  LocalProfile,
  NotificationItem,
} from './types';
import { formatRelativeTime } from './utils/timeUtils';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { FeedView } from './components/FeedView';
import { DiscoveryView } from './components/DiscoveryView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { SpotlightModal } from './components/SpotlightModal';
import { MessengerDock } from './components/MessengerDock';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Home, Compass, Coffee, Bell, User } from 'lucide-react';

export const App: React.FC = () => {
  // Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('tambayan-theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('tambayan-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('tambayan-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // Authentication State (100% Real Firebase Auth)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Tambayan User',
          avatar: firebaseUser.photoURL || '/images/app_icon.webp',
          createdAt: Date.now(),
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Subscriptions
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tambayan-saved-posts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [readNotifIds, setReadNotifIds] = useState<Record<string, boolean>>({});
  const [customBio, setCustomBio] = useState<string>('Creative & Coffee Enthusiast');
  const [customLocation, setCustomLocation] = useState<string>('Metro Manila, Philippines');

  useEffect(() => {
    const unsubPosts = RealtimeService.subscribePosts((livePosts) => {
      setPosts(livePosts);
    });

    const unsubStories = RealtimeService.subscribeStories((liveStories) => {
      setStories(liveStories);
    });

    return () => {
      unsubPosts();
      unsubStories();
    };
  }, []);

  // Derive Real-time Notifications from Live Posts & Comments
  const liveNotifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];
    posts.forEach((p) => {
      // Comments on posts
      (p.comments || []).forEach((c) => {
        if (!currentUser || c.authorId !== currentUser.uid) {
          items.push({
            id: `notif_comm_${c.id}`,
            type: 'tag',
            authorName: c.authorName,
            authorAvatar: c.authorAvatar,
            timeAgo: formatRelativeTime(c.createdAt),
            content: c.content,
            previewImage: p.imageWebP || undefined,
            read: !!readNotifIds[`notif_comm_${c.id}`],
          });
        }
      });

      // Recent community posts
      if (!currentUser || p.authorId !== currentUser.uid) {
        items.push({
          id: `notif_post_${p.id}`,
          type: p.content.includes('@') ? 'mention' : 'chat',
          authorName: p.authorName,
          authorAvatar: p.authorAvatar,
          timeAgo: formatRelativeTime(p.createdAt),
          content: p.content.length > 90 ? `${p.content.slice(0, 90)}...` : p.content,
          previewImage: p.imageWebP || undefined,
          read: !!readNotifIds[`notif_post_${p.id}`],
        });
      }
    });
    return items.slice(0, 15);
  }, [posts, currentUser, readNotifIds]);

  const unreadCount = liveNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    const next: Record<string, boolean> = { ...readNotifIds };
    liveNotifications.forEach((n) => {
      next[n.id] = true;
    });
    setReadNotifIds(next);
  };

  const handleToggleSavePost = (postId: string) => {
    setSavedPostIds((prev) => {
      const exists = prev.includes(postId);
      const updated = exists ? prev.filter((id) => id !== postId) : [...prev, postId];
      try {
        localStorage.setItem('tambayan-saved-posts', JSON.stringify(updated));
      } catch {
        // ignore storage quota errors
      }
      return updated;
    });
  };

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Actions
  const handleToggleReaction = async (postId: string, reaction: ReactionType, currentPost: Post) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    await RealtimeService.toggleReaction(postId, currentUser.uid, reaction, currentPost);
  };

  const handleAddComment = async (postId: string, text: string, parentId?: string | null) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    const targetPost = posts.find((p) => p.id === postId);
    await RealtimeService.addComment(
      postId,
      currentUser,
      text,
      targetPost?.comments || [],
      parentId
    );
  };

  const handleCreatePost = async (
    content: string,
    imageWebP?: string | null,
    privacy: 'Public' | 'Friends' | 'Only me' = 'Public',
    tags: string[] = []
  ) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    await RealtimeService.createPost(currentUser, content, imageWebP, privacy, tags);
  };

  const handleDeletePost = async (postId: string) => {
    if (!currentUser) return;
    await RealtimeService.deletePost(postId);
  };

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setIsGuestMode(false);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  // Static structure for Communities & Hangouts (without fake user posts)
  const [hangouts, setHangouts] = useState([
    {
      id: 'hangout-1',
      title: 'The Daily Grind Lounge',
      subtitle: 'Chill coworking room & lo-fi cafe beats',
      activeCount: 14,
      image: '/images/hangout_daily.webp',
      category: 'Coffee & Chill',
      isJoined: false,
      hostName: 'CoffeeLovers PH',
    },
    {
      id: 'hangout-2',
      title: 'Central Park Porch',
      subtitle: 'Chess, acoustic guitar & casual kwentuhan',
      activeCount: 8,
      image: '/images/hangout_porch.webp',
      category: 'Acoustic & Casual',
      isJoined: false,
      hostName: 'Indie Music Collective',
    },
  ]);

  const [communities, setCommunities] = useState<Community[]>([
    {
      id: 'comm-1',
      name: 'Coffee Lovers Society',
      membersCount: '1.4k members',
      image: '/images/community_coffee.webp',
      tag: '#CoffeeGeeks',
      color: '#FC7847',
      description: 'For everyone who takes their pour-overs, cold brews, and cafe-hopping seriously.',
      isMember: true,
    },
    {
      id: 'comm-2',
      name: 'Urban Art Collective',
      membersCount: '890 members',
      image: '/images/post_cafe.webp',
      tag: '#StreetArt',
      color: '#15616C',
      description: 'Digital illustrators, photographers, sketchers, and mural painters sharing their work.',
      isMember: false,
    },
    {
      id: 'comm-3',
      name: 'City Park Meetups',
      membersCount: '2.1k members',
      image: '/images/hangout_porch.webp',
      tag: '#WeekendVibes',
      color: '#E5A93C',
      description: 'Casual outdoor picnics, weekend markets, board games, and neighborhood hangouts.',
      isMember: false,
    },
  ]);

  const [locals, setLocals] = useState<LocalProfile[]>([
    {
      id: 'loc-1',
      name: 'Maya R.',
      role: 'Photographer',
      avatar: '/images/avatar_maya.webp',
      isOnline: true,
      isConnected: false,
      bio: 'Documenting everyday street moments & sunset architecture. Always carrying 35mm film.',
    },
    {
      id: 'loc-2',
      name: 'Leo J.',
      role: 'Food & Travel Guide',
      avatar: '/images/avatar_leo.webp',
      isOnline: true,
      isConnected: false,
      bio: 'Knows every hidden cafe, night market, and rooftop spot around the city.',
    },
  ]);

  const handleToggleJoinHangout = (id: string) => {
    setHangouts((prev) =>
      prev.map((h) => (h.id === id ? { ...h, isJoined: !h.isJoined } : h))
    );
  };

  const handleToggleJoinCommunity = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isMember: !c.isMember } : c))
    );
  };

  const handleToggleConnectLocal = (id: string) => {
    setLocals((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isConnected: !l.isConnected } : l))
    );
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  // If not logged in and not explicitly exploring as guest, render Facebook-style Landing Page
  if (!currentUser && !isGuestMode) {
    return (
      <LandingPage
        onLoginSuccess={() => setIsGuestMode(false)}
        onExploreGuest={() => setIsGuestMode(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openCreateModal={() => {
          if (!currentUser) setIsAuthOpen(true);
          else setIsCreateModalOpen(true);
        }}
        user={{
          name: currentUser?.displayName || 'Guest User',
          handle: currentUser ? `@${currentUser.displayName.toLowerCase().replace(/\s+/g, '')}` : '@guest',
          avatar: currentUser?.avatar || '/images/app_icon.webp',
          coverImage: '/images/cover_profile.webp',
          bio: customBio,
          location: customLocation,
          postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
          followersCount: locals.filter((l) => l.isConnected).length,
          followingCount: communities.filter((c) => c.isMember).length,
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onOpenAuth={() => setIsGuestMode(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        unreadCount={unreadCount}
      />

      {/* Main 3-Column Content Layout */}
      <main className="main-wrapper">
        {/* Left Column Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={{
            name: currentUser?.displayName || 'Guest Visitor',
            handle: currentUser ? `@${currentUser.displayName.toLowerCase().replace(/\s+/g, '')}` : 'Sign in to connect',
            avatar: currentUser?.avatar || '/images/app_icon.webp',
            coverImage: '/images/cover_profile.webp',
            bio: customBio,
            location: currentUser ? customLocation : 'Welcome to Tambayan',
            postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
            followersCount: locals.filter((l) => l.isConnected).length,
            followingCount: communities.filter((c) => c.isMember).length,
          }}
          unreadCount={unreadCount}
        />

        {/* Center Main View */}
        <section style={{ minWidth: 0 }}>
          {currentTab === 'feed' && (
            <FeedView
              posts={filteredPosts}
              currentUser={currentUser}
              stories={stories}
              onToggleReaction={handleToggleReaction}
              onAddComment={handleAddComment}
              onCreatePost={handleCreatePost}
              onDeletePost={handleDeletePost}
              savedPostIds={savedPostIds}
              onToggleSavePost={handleToggleSavePost}
              onOpenAuth={() => setIsAuthOpen(true)}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          )}

          {currentTab === 'explore' && (
            <DiscoveryView
              communities={communities}
              onToggleJoinCommunity={handleToggleJoinCommunity}
              locals={locals}
              onToggleConnectLocal={handleToggleConnectLocal}
            />
          )}

          {currentTab === 'hangouts' && (
            <div className="feed-stream-col">
              <div
                style={{
                  background: 'var(--surface-card)',
                  padding: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h2 style={{ fontSize: '22px' }}>☕ Live Tambayan Hangouts</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Live audio & chat lounges hosted by communities, creators, music lovers, and coffee aficionados.
                </p>
              </div>

              <div className="explore-grid">
                {hangouts.map((h) => (
                  <div key={h.id} className="community-card">
                    <img src={h.image} alt={h.title} className="community-card-banner" />
                    <div className="community-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="spotlight-tag">{h.category}</span>
                        <div className="hangout-live-indicator">
                          <span className="live-pulse" />
                          <span>{h.activeCount} active</span>
                        </div>
                      </div>
                      <h4 className="community-card-title">{h.title}</h4>
                      <p className="community-card-desc">{h.subtitle}</p>
                      <button
                        className={`btn-join-hangout ${h.isJoined ? 'joined' : ''}`}
                        onClick={() => handleToggleJoinHangout(h.id)}
                        style={{ width: '100%', marginTop: '8px', padding: '10px' }}
                      >
                        {h.isJoined ? 'Entered Lounge (You are in)' : 'Join Hangout Room'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'notifications' && (
            <NotificationsView
              notifications={liveNotifications}
              onMarkAllRead={handleMarkAllRead}
              onReplyClick={() => setCurrentTab('feed')}
            />
          )}

          {(currentTab === 'profile' || currentTab === 'saved') && (
            <ProfileView
              initialTab={currentTab === 'saved' ? 'saved' : 'posts'}
              user={{
                name: currentUser?.displayName || 'Tambayan User',
                handle: currentUser ? `@${currentUser.displayName.toLowerCase().replace(/\s+/g, '')}` : '@guest',
                avatar: currentUser?.avatar || '/images/app_icon.webp',
                coverImage: '/images/cover_profile.webp',
                bio: currentUser ? customBio : 'Sign in to customize your profile',
                location: customLocation,
                postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
                followersCount: locals.filter((l) => l.isConnected).length,
                followingCount: communities.filter((c) => c.isMember).length,
              }}
              onUpdateProfile={(updated) => {
                if (currentUser && updated.name) {
                  setCurrentUser({ ...currentUser, displayName: updated.name });
                }
                if (currentUser && updated.avatar) {
                  setCurrentUser({ ...currentUser, avatar: updated.avatar });
                }
                if (updated.bio !== undefined) setCustomBio(updated.bio);
                if (updated.location !== undefined) setCustomLocation(updated.location);
              }}
              userPosts={posts.filter((p) => p.authorId === currentUser?.uid)}
              savedPosts={posts.filter((p) => savedPostIds.includes(p.id))}
              onToggleSavePost={handleToggleSavePost}
              communities={communities}
            />
          )}
        </section>

        {/* Right Column Panel */}
        <RightPanel
          hangouts={hangouts}
          onToggleJoinHangout={handleToggleJoinHangout}
          selectedTag={selectedTag}
          onSelectTag={(tag) => {
            setSelectedTag(tag);
            if (tag && currentTab !== 'feed') setCurrentTab('feed');
          }}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
        />
      </main>

      {/* Floating Messenger Dock (Facebook Style) */}
      <MessengerDock
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={{
          name: currentUser?.displayName || 'Tambayan Member',
          handle: '@user',
          avatar: currentUser?.avatar || '/images/app_icon.webp',
          coverImage: '/images/cover_profile.webp',
          bio: '',
          location: '',
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
        }}
        onCreatePost={(c, img, priv, tags) => handleCreatePost(c, img, priv, tags)}
      />

      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar (Facebook Mobile / iOS App Style) */}
      <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          className={`mobile-nav-item ${currentTab === 'feed' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('feed');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Feed"
        >
          <Home size={22} />
          <span>Feed</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'explore' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Explore"
        >
          <Compass size={22} />
          <span>Explore</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'hangouts' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('hangouts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Hangouts"
        >
          <Coffee size={22} />
          <span>Hangouts</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'notifications' ? 'active' : ''}`}
          onClick={() => {
            setCurrentTab('notifications');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          title="Notifications"
        >
          <Bell size={22} />
          <span>Alerts</span>
        </button>

        <button
          className={`mobile-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
          onClick={() => {
            if (!currentUser) setIsAuthOpen(true);
            else {
              setCurrentTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          title="Profile"
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt="Profile"
              className="mobile-nav-avatar"
            />
          ) : (
            <User size={22} />
          )}
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
