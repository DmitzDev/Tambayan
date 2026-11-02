import React, { useState } from 'react';
import { Bell, CheckCheck, Heart, MessageSquare, Sparkles } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onReplyClick?: (notification: NotificationItem) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onReplyClick,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mentions'>('all');
  const [likedNotifs, setLikedNotifs] = useState<Record<string, boolean>>({});
  const [repliedNotifs, setRepliedNotifs] = useState<Record<string, boolean>>({});

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
          padding: '14px 18px',
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: '10px',
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
            All Activity ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('mentions')}
            className="tool-chip"
            style={{
              backgroundColor: activeFilter === 'mentions' ? 'var(--primary)' : 'var(--bg-subtle)',
              color: activeFilter === 'mentions' ? '#FFF' : 'var(--text-secondary)',
            }}
          >
            @ Mentions
          </button>
        </div>

        {notifications.some((n) => !n.read) && (
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
        )}
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={26} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No notifications right now</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '360px', lineHeight: 1.5 }}>
            When friends comment on your posts, react to your stories, or mention you in discussions, they will show up here in real time.
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifs.map((n) => (
            <div key={n.id} className={`notification-card ${!n.read ? 'unread' : ''}`}>
              <img src={n.authorAvatar} alt={n.authorName} className="notif-avatar" />

              <div className="notif-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                    <strong>{n.authorName}</strong>{' '}
                    {n.type === 'mention'
                      ? 'mentioned you in a post'
                      : n.type === 'tag'
                      ? 'commented on a post'
                      : 'shared an update on Tambayan'}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {n.timeAgo}
                  </span>
                </div>

                {/* Quote or message body */}
                <div className="notif-quote">"{n.content}"</div>

                {/* Optional preview thumbnail */}
                {n.previewImage && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={n.previewImage}
                      alt="Post thumbnail"
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
                      <span>{likedNotifs[n.id] ? 'Liked' : 'Quick Like'}</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                  <button
                    className="btn-join-hangout"
                    style={{
                      padding: '5px 14px',
                      fontSize: '11px',
                      background: repliedNotifs[n.id] ? 'var(--secondary-light)' : 'var(--secondary)',
                      color: repliedNotifs[n.id] ? 'var(--secondary)' : '#FFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                    onClick={() => {
                      setRepliedNotifs((prev) => ({ ...prev, [n.id]: true }));
                      if (onReplyClick) onReplyClick(n);
                    }}
                  >
                    {repliedNotifs[n.id] ? (
                      <>
                        <Sparkles size={12} /> Viewed in Feed
                      </>
                    ) : (
                      <>
                        <MessageSquare size={12} /> View Discussion
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
