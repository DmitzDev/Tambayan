import React, { useState } from 'react';
import { AtSign, Tag, MessageSquare, CheckCheck, Heart } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions'>('all');
  const [likedNotifs, setLikedNotifs] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedNotifs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredNotifs =
    activeFilter === 'mentions'
      ? notifications.filter((n) => n.type === 'mention')
      : notifications;

  return (
    <div className="feed-stream-col">
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveFilter('all')}
            className="tool-chip"
            style={{
              backgroundColor: activeFilter === 'all' ? 'var(--primary)' : 'var(--bg-subtle)',
              color: activeFilter === 'all' ? '#FFF' : 'var(--text-secondary)',
            }}
          >
            All Notifications
          </button>
          <button
            onClick={() => setActiveFilter('mentions')}
            className="tool-chip"
            style={{
              backgroundColor: activeFilter === 'mentions' ? 'var(--primary)' : 'var(--bg-subtle)',
              color: activeFilter === 'mentions' ? '#FFF' : 'var(--text-secondary)',
            }}
          >
            @ Mentions Only
          </button>
        </div>

        <button
          onClick={onMarkAllRead}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--primary)',
            fontWeight: 700,
          }}
        >
          <CheckCheck size={16} /> Mark all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifs.map((n) => (
          <div key={n.id} className={`notification-card ${!n.read ? 'unread' : ''}`}>
            <img src={n.authorAvatar} alt={n.authorName} className="notif-avatar" />

            <div className="notif-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                  <strong>{n.authorName}</strong>{' '}
                  {n.type === 'mention'
                    ? 'mentioned you in a discussion'
                    : n.type === 'tag'
                    ? 'tagged you in a photo'
                    : 'mentioned you in group chat'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.timeAgo}</span>
              </div>

              {/* Quote or message body */}
              <div className="notif-quote">"{n.content}"</div>

              {/* Optional preview thumbnail */}
              {n.previewImage && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={n.previewImage}
                    alt="Tagged thumbnail"
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => toggleLike(n.id)}
                    className="tool-chip"
                    style={{
                      background: likedNotifs[n.id] ? 'var(--primary-light)' : 'var(--bg-subtle)',
                      color: likedNotifs[n.id] ? 'var(--primary)' : 'var(--text-secondary)',
                    }}
                  >
                    <Heart size={14} fill={likedNotifs[n.id] ? 'currentColor' : 'none'} />
                    <span>{likedNotifs[n.id] ? 'Liked' : 'Like Photo'}</span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn-join-hangout"
                  style={{
                    padding: '4px 14px',
                    fontSize: '11px',
                    background: 'var(--secondary)',
                  }}
                  onClick={() => alert(`Replying to ${n.authorName}...`)}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
