import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { RealtimeService } from './services/realtimeService';
import { Post, Story, UserAccount, ReactionType, Community, LocalProfile } from './types';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'Campus Student',
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

  const handleSignOut = async () => {
    await firebaseSignOut(auth);
  };

  // Static structure for Communities & Hangouts (without fake user posts)
  const [hangouts, setHangouts] = useState([
    {
      id: 'hangout-1',
      title: 'The Daily Grind Lounge',
      subtitle: 'Chill study room & lo-fi cafe beats',
      activeCount: 14,
      image: '/images/hangout_daily.webp',
      category: 'Coffee & Study',
      isJoined: false,
      hostName: 'CoffeeLovers UP',
    },
    {
      id: 'hangout-2',
      title: 'Central Park Porch',
      subtitle: 'Chess, acoustic guitar & casual banter',
      activeCount: 8,
      image: '/images/hangout_porch.webp',
      category: 'Acoustic & Casual',
      isJoined: false,
      hostName: 'Campus Music Club',
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
      description: 'For students who take their pour-overs, cold brews, and cafe-hopping seriously.',
      isMember: true,
    },
    {
      id: 'comm-2',
      name: 'Urban Art Collective',
      membersCount: '890 members',
      image: '/images/post_cafe.webp',
      tag: '#StreetArt',
      color: '#15616C',
      description: 'Digital illustrators, photographers, sketchers, and mural painters across campuses.',
      isMember: false,
    },
    {
      id: 'comm-3',
      name: 'City Park Meetups',
      membersCount: '2.1k members',
      image: '/images/hangout_porch.webp',
      tag: '#WeekendVibes',
      color: '#E5A93C',
      description: 'Casual outdoor picnics, frisbee tosses, board games, and weekend relaxation groups.',
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
      bio: 'Documenting campus moments & sunset architecture. Always carrying 35mm film.',
    },
    {
      id: 'loc-2',
      name: 'Leo J.',
      role: 'Local Guide',
      avatar: '/images/avatar_leo.webp',
      isOnline: true,
      isConnected: false,
      bio: 'Knows every affordable carinderia and hidden rooftop around Katipunan.',
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
          bio: 'Campus student exploring Tambayan',
          campus: 'University Campus',
          postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
          followersCount: 0,
          followingCount: 0,
        }}
        isDark={isDark}
        toggleTheme={toggleTheme}
        unreadCount={0}
      />

      {/* Main 3-Column Content Layout */}
      <main className="main-wrapper">
        {/* Left Column Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          user={{
            name: currentUser?.displayName || 'Guest Student',
            handle: currentUser ? `@${currentUser.displayName.toLowerCase().replace(/\s+/g, '')}` : 'Sign in to join',
            avatar: currentUser?.avatar || '/images/app_icon.webp',
            coverImage: '/images/cover_profile.webp',
            bio: 'Active Tambayan participant',
            campus: currentUser ? 'Verified Student' : 'Welcome to Tambayan',
            postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
            followersCount: 0,
            followingCount: 0,
          }}
          unreadCount={0}
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
                <h2 style={{ fontSize: '22px' }}>☕ Active Campus Hangouts</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Live audio & chat lounges hosted by student clubs, study groups, and coffee aficionados.
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
              notifications={[]}
              onMarkAllRead={() => {}}
            />
          )}

          {(currentTab === 'profile' || currentTab === 'saved') && (
            <ProfileView
              user={{
                name: currentUser?.displayName || 'Campus Student',
                handle: currentUser ? `@${currentUser.displayName.toLowerCase().replace(/\s+/g, '')}` : '@guest',
                avatar: currentUser?.avatar || '/images/app_icon.webp',
                coverImage: '/images/cover_profile.webp',
                bio: currentUser ? 'Architecture & Creative student' : 'Sign in to edit your profile',
                campus: 'University Campus',
                postsCount: posts.filter((p) => p.authorId === currentUser?.uid).length,
                followersCount: 0,
                followingCount: 0,
              }}
              onUpdateProfile={(updated) => {
                if (currentUser && updated.name) {
                  setCurrentUser({ ...currentUser, displayName: updated.name });
                }
              }}
              userPosts={posts.filter((p) => p.authorId === currentUser?.uid)}
              communities={communities}
            />
          )}
        </section>

        {/* Right Column Panel */}
        <RightPanel
          hangouts={hangouts}
          onToggleJoinHangout={handleToggleJoinHangout}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
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
          name: currentUser?.displayName || 'Student',
          handle: '@user',
          avatar: currentUser?.avatar || '/images/app_icon.webp',
          coverImage: '/images/cover_profile.webp',
          bio: '',
          campus: '',
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
        }}
        onCreatePost={(c, img, priv) => handleCreatePost(c, img, priv)}
      />

      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};
