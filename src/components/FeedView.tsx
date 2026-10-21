import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Users,
  Lock,
  Pin,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Post, UserProfile } from '../types';

interface FeedViewProps {
  posts: Post[];
  user: UserProfile;
  onLikePost: (id: string) => void;
  onCreatePost: (content: string, image?: string, privacy?: 'Public' | 'Friends' | 'Only me') => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  user,
  onLikePost,
  onCreatePost,
  selectedTag,
  onSelectTag,
}) => {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<Record<string, { id: string; author: string; text: string; time: string }[]>>({
    'post-1': [
      { id: 'c1', author: 'Leo Reyes', text: 'Sarap dyan! Try mo rin yung spanish latte nila.', time: '1h ago' },
      { id: 'c2', author: 'Sam Lee', text: 'Is wifi fast enough for Figma and video calls?', time: '45m ago' },
    ],
  });

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage) return;

    onCreatePost(content.trim(), attachedImage || undefined, privacy);
    setContent('');
    setAttachedImage(null);

    // Celebratory confetti burst
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FC7847', '#15616C', '#E5A93C'],
    });
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: user.name,
      text: commentText.trim(),
      time: 'Just now',
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setCommentText('');
  };

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()))
    : posts;

  return (
    <div className="feed-stream-col">
      {/* Tag Filter Banner */}
      {selectedTag && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '14px' }}>
              Showing posts tagged with #{selectedTag}
            </span>
          </div>
          <button
            onClick={() => onSelectTag(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            <X size={16} /> Show All
          </button>
        </div>
      )}

      {/* Create Post Card */}
      <form className="create-post-card" onSubmit={handlePublish}>
        <div className="create-post-header">
          <img src={user.avatar} alt={user.name} className="create-avatar" />
          <textarea
            className="create-textarea"
            placeholder="What's happening in your campus today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {attachedImage && (
          <div className="create-image-preview-box">
            <img src={attachedImage} alt="Post preview" className="create-image-preview" />
            <button
              type="button"
              className="remove-img-btn"
              onClick={() => setAttachedImage(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="create-post-footer">
          <div className="create-post-tools">
            <label className="tool-chip" style={{ cursor: 'pointer' }}>
              <ImageIcon size={16} color="var(--secondary)" />
              <span>Attach Media (.webp)</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImagePick}
              />
            </label>

            {/* Privacy Select */}
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="tool-chip"
              style={{ border: 'none', outline: 'none' }}
            >
              <option value="Public">🌍 Public</option>
              <option value="Friends">👥 Friends</option>
              <option value="Only me">🔒 Only Me</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-create-post"
            style={{ padding: '8px 20px', fontSize: '13px' }}
            disabled={!content.trim() && !attachedImage}
          >
            Publish
          </button>
        </div>
      </form>

      {/* Posts Stream */}
      {filteredPosts.map((post) => (
        <article key={post.id} className="post-card">
          {post.isPinned && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '-4px',
              }}
            >
              <Pin size={14} /> Pinned Post
            </div>
          )}

          {/* Author Header */}
          <div className="post-author-row">
            <div className="post-author-meta">
              <img src={post.authorAvatar} alt={post.authorName} className="post-author-avatar" />
              <div className="post-author-names">
                <span className="author-title">{post.authorName}</span>
                <span className="author-handle-time">
                  {post.authorHandle} • {post.timeAgo} •
                  <span className="privacy-badge">
                    {post.privacy === 'Public' ? (
                      <Globe size={11} />
                    ) : post.privacy === 'Friends' ? (
                      <Users size={11} />
                    ) : (
                      <Lock size={11} />
                    )}
                    {post.privacy}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="post-content-text">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className="post-media-container">
              <img src={post.image} alt="Post asset" className="post-media-img" loading="lazy" />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags-row">
              {post.tags.map((t) => (
                <button
                  key={t}
                  className="post-tag-chip"
                  onClick={() => onSelectTag(t)}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="post-action-bar">
            <button
              className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
              onClick={() => onLikePost(post.id)}
            >
              <Heart size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
              <span>{post.likes}</span>
            </button>

            <button
              className="post-action-btn"
              onClick={() =>
                setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
              }
            >
              <MessageCircle size={18} />
              <span>
                {(postComments[post.id] ? postComments[post.id].length : post.commentsCount)}
              </span>
            </button>

            <button
              className="post-action-btn"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Post link copied to clipboard!');
              }}
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
          </div>

          {/* Inline Comments Drawer */}
          {activeCommentPostId === post.id && (
            <div
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Existing comments */}
              {(postComments[post.id] || []).map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      marginBottom: '2px',
                    }}
                  >
                    <span>{c.author}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.time}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{c.text}</p>
                </div>
              ))}

              {/* Add comment input */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment(post.id);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  style={{
                    background: 'var(--primary)',
                    color: '#FFF',
                    borderRadius: 'var(--radius-full)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
