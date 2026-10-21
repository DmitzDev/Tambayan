import React from 'react';
import { Newspaper, Compass, Coffee, Bell, User, Bookmark } from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  unreadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  unreadCount,
}) => {
  const navItems = [
    { id: 'feed', label: 'Campus Feed', icon: Newspaper },
    { id: 'explore', label: 'Explore & Groups', icon: Compass },
    { id: 'hangouts', label: 'Live Hangouts', icon: Coffee },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'saved', label: 'Saved Items', icon: Bookmark },
  ];

  return (
    <aside className="sidebar-col">
      {/* Navigation Card */}
      <nav className="nav-menu-card">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="nav-item-badge">{item.badge}</span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* User Quick Overview */}
      <div className="sidebar-profile-card">
        <img src={user.avatar} alt={user.name} className="side-avatar-large" />
        <div>
          <h4 className="side-user-name">{user.name}</h4>
          <span className="side-user-handle">{user.handle}</span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {user.campus}
        </p>

        <div className="side-stats-grid">
          <div className="side-stat-item">
            <span className="side-stat-num">{user.postsCount}</span>
            <span className="side-stat-lbl">Posts</span>
          </div>
          <div className="side-stat-item">
            <span className="side-stat-num">{user.followersCount}</span>
            <span className="side-stat-lbl">Followers</span>
          </div>
          <div className="side-stat-item">
            <span className="side-stat-num">{user.followingCount}</span>
            <span className="side-stat-lbl">Following</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
