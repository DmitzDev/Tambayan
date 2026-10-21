import React, { useState, useEffect } from 'react';
import { Newspaper, Compass, Coffee, Bell, User } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { FeedView } from './components/FeedView';
import { DiscoveryView } from './components/DiscoveryView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { CreatePostModal } from './components/CreatePostModal';
import { SpotlightModal } from './components/SpotlightModal';
import {
  initialPosts,
  initialHangouts,
  initialCommunities,
  initialNotifications,
  initialLocals,
  currentUserData,
} from './data/initialData';
import { Post, UserProfile } from './types';

export const App: React.FC = () => {
  // Theme state
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

  // Core App State
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [user, setUser] = useState<UserProfile>(currentUserData);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hangouts, setHangouts] = useState(initialHangouts);
  const [communities, setCommunities] = useState(initialCommunities);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [locals, setLocals] = useState(initialLocals);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Handlers
  const handleLikePost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (
    content: string,
    image?: string,
    privacy: 'Public' | 'Friends' | 'Only me' = 'Public'
  ) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorHandle: user.handle,
      authorAvatar: user.avatar,
      timeAgo: 'Just now',
      content,
      image,
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      repostsCount: 0,
      privacy,
      tags: content.match(/#[a-zA-Z0-9_]+/g)?.map((t) => t.substring(1)) || ['Tambayan'],
    };

    setPosts([newPost, ...posts]);
    setUser((prev) => ({ ...prev, postsCount: prev.postsCount + 1 }));
  };

  const handleToggleJoinHangout = (id: string) => {
    setHangouts((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const isJoined = !h.isJoined;
          return {
            ...h,
            isJoined,
            activeCount: isJoined ? h.activeCount + 1 : Math.max(1, h.activeCount - 1),
          };
        }
        return h;
      })
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

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Search filtering
  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="app-layout">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openCreateModal={() => setIsCreateModalOpen(true)}
        user={user}
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
          user={user}
          unreadCount={unreadCount}
        />

        {/* Center Main View */}
        <section style={{ minWidth: 0 }}>
          {currentTab === 'feed' && (
            <FeedView
              posts={filteredPosts}
              user={user}
              onLikePost={handleLikePost}
              onCreatePost={handleCreatePost}
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
                  Live audio & chat lounges hosted by campus clubs, coffee aficionados, and study groups.
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
                        {h.isJoined ? 'Enter Lounge (You are in)' : 'Join Hangout Room'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          )}

          {(currentTab === 'profile' || currentTab === 'saved') && (
            <ProfileView
              user={user}
              onUpdateProfile={handleUpdateProfile}
              userPosts={posts.filter((p) => p.authorHandle === user.handle)}
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

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-bar">
        {[
          { id: 'feed', icon: Newspaper, label: 'Feed' },
          { id: 'explore', icon: Compass, label: 'Explore' },
          { id: 'hangouts', icon: Coffee, label: 'Hangouts' },
          { id: 'notifications', icon: Bell, label: 'Inbox', badge: unreadCount },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                position: 'relative',
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>
                {tab.label}
              </span>
              {tab.badge && tab.badge > 0 ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    background: 'var(--primary)',
                    color: '#FFF',
                    fontSize: '9px',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        user={user}
        onCreatePost={handleCreatePost}
      />

      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />
    </div>
  );
};
