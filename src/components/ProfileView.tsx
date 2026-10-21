import React, { useState } from 'react';
import { Camera, Edit3, MapPin, Grid, Bookmark, Users, Heart } from 'lucide-react';
import { UserProfile, Post, Community } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  userPosts: Post[];
  communities: Community[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  userPosts,
  communities,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'communities'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editCampus, setEditCampus] = useState(user.campus);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      campus: editCampus.trim(),
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateProfile({ avatar: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-view-wrapper">
      {/* Hero Card */}
      <div className="profile-hero-card">
        <img src={user.coverImage} alt="Profile Cover" className="profile-cover-img" />

        <div className="profile-hero-content">
          <div className="profile-avatar-row">
            <div style={{ position: 'relative' }}>
              <img src={user.avatar} alt={user.name} className="profile-main-avatar" />
              <label
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  right: '4px',
                  background: 'var(--primary)',
                  color: '#FFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px solid var(--surface-card)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Change Avatar"
              >
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            <button
              className="btn-join-hangout"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'var(--primary)',
                fontSize: '13px',
              }}
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>

          <div>
            <h2 className="profile-name-title">{user.name}</h2>
            <span className="profile-handle-sub">{user.handle}</span>
          </div>

          <p className="profile-bio-text">{user.bio}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <MapPin size={15} color="var(--primary)" />
            <span>{user.campus}</span>
          </div>

          {/* Stats Bar */}
          <div className="profile-stats-bar">
            <div className="p-stat-group">
              <span className="p-stat-val">{userPosts.length}</span>
              <span style={{ color: 'var(--text-muted)' }}>Posts</span>
            </div>
            <div className="p-stat-group">
              <span className="p-stat-val">{user.followersCount}</span>
              <span style={{ color: 'var(--text-muted)' }}>Followers</span>
            </div>
            <div className="p-stat-group">
              <span className="p-stat-val">{user.followingCount}</span>
              <span style={{ color: 'var(--text-muted)' }}>Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('posts')}
          className={`nav-item-btn ${activeTab === 'posts' ? 'active' : ''}`}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Grid size={18} /> My Posts ({userPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`nav-item-btn ${activeTab === 'saved' ? 'active' : ''}`}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Bookmark size={18} /> Saved (4)
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`nav-item-btn ${activeTab === 'communities' ? 'active' : ''}`}
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          <Users size={18} /> My Communities ({communities.filter((c) => c.isMember).length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-author-row">
                <div className="post-author-meta">
                  <img src={post.authorAvatar} alt={post.authorName} className="post-author-avatar" />
                  <div className="post-author-names">
                    <span className="author-title">{post.authorName}</span>
                    <span className="author-handle-time">{post.authorHandle} • {post.timeAgo}</span>
                  </div>
                </div>
              </div>
              <p className="post-content-text">{post.content}</p>
              {post.image && (
                <div className="post-media-container">
                  <img src={post.image} alt="post" className="post-media-img" />
                </div>
              )}
              <div className="post-action-bar">
                <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={16} fill="currentColor" /> {post.likes} Likes
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {post.commentsCount} Comments
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="explore-grid">
          <div className="community-card">
            <img src="/images/post_cafe.webp" alt="Saved cafe" className="community-card-banner" />
            <div className="community-card-body">
              <h4 className="community-card-title">Best Cafe Spots for Architecture Students</h4>
              <p className="community-card-desc">Saved from Maya Santos • Poblacion cafe guide</p>
            </div>
          </div>

          <div className="community-card">
            <img src="/images/spotlight_flea.webp" alt="Saved event" className="community-card-banner" />
            <div className="community-card-body">
              <h4 className="community-card-title">Weekend Flea Market Vendor Registration</h4>
              <p className="community-card-desc">Saved from Campus Events Board</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'communities' && (
        <div className="explore-grid">
          {communities
            .filter((c) => c.isMember)
            .map((comm) => (
              <div key={comm.id} className="community-card">
                <img src={comm.image} alt={comm.name} className="community-card-banner" />
                <div className="community-card-body">
                  <h4 className="community-card-title">{comm.name}</h4>
                  <p className="community-card-desc">{comm.description}</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button onClick={() => setIsEditing(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="modal-body">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="nav-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Campus & Department
                  </label>
                  <input
                    type="text"
                    value={editCampus}
                    onChange={(e) => setEditCampus(e.target.value)}
                    className="nav-search-input"
                    style={{ paddingLeft: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="create-textarea"
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="tool-chip"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-create-post">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
