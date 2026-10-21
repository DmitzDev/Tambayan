import React from 'react';
import { Search, Plus, Bell, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openCreateModal: () => void;
  user: UserProfile;
  isDark: boolean;
  toggleTheme: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  openCreateModal,
  user,
  isDark,
  toggleTheme,
  unreadCount,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => setCurrentTab('feed')}>
          <div className="brand-icon-box">
            <img src="/images/app_icon.webp" alt="Tambayan Icon" className="brand-logo-img" />
          </div>
          <div className="brand-text-block">
            <span className="brand-name">Tambayan</span>
            <span className="brand-badge">Campus Community</span>
          </div>
        </div>

        {/* Global Search */}
        <div className="nav-search-bar">
          <Search size={18} className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search posts, topics, or campus hangouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Warm Light Mode' : 'Switch to Midnight Dark Mode'}
          >
            {isDark ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Notifications Bell */}
          <button
            className="icon-btn"
            onClick={() => setCurrentTab('notifications')}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="badge-dot" />}
          </button>

          {/* New Post Button */}
          <button className="btn-create-post" onClick={openCreateModal}>
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Post</span>
          </button>

          {/* User Profile Pill */}
          <div className="nav-profile-pill" onClick={() => setCurrentTab('profile')}>
            <img src={user.avatar} alt={user.name} className="nav-avatar-img" />
            <span className="nav-profile-name">{user.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
