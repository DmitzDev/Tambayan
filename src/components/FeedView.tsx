import React, { useState } from 'react';
import {
  Image as ImageIcon,
  MessageCircle,
  Share2,
  Globe,
  Users,
  Lock,
  Pin,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Post, UserAccount, ReactionType, Story } from '../types';
import { ReactionsBar } from './ReactionsBar';
import { CommentThread } from './CommentThread';
import { StoriesBar } from './StoriesBar';
import { convertToWebP } from '../utils/webpConverter';

interface FeedViewProps {
  posts: Post[];
  currentUser: UserAccount | null;
  stories: Story[];
  onToggleReaction: (postId: string, reaction: ReactionType, currentPost: Post) => void;
  onAddComment: (postId: string, text: string, parentId?: string | null) => void;
  onCreatePost: (
    content: string,
    imageWebP?: string | null,
    privacy?: 'Public' | 'Friends' | 'Only me',
    tags?: string[]
  ) => void;
  onOpenAuth: () => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  stories,
  onToggleReaction,
  onAddComment,
  onCreatePost,
  onOpenAuth,
  selectedTag,
  onSelectTag,
}) => {
  const [content, setContent] = useState('');
  const [attachedWebP, setAttachedWebP] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImg(true);
      try {
        const webp = await convertToWebP(file, 1200, 1200, 0.82);
        setAttachedWebP(webp);
      } catch (err) {
        alert('Could not convert image to .webp format');
      } finally {
        setIsProcessingImg(false);
      }
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedWebP) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const tags = content.match(/#[a-zA-Z0-9_]+/g)?.map((t) => t.substring(1)) || [];
    onCreatePost(content.trim(), attachedWebP, privacy, tags);

    setContent('');
    setAttachedWebP(null);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#FC7847', '#15616C', '#E5A93C'],
    });
  };

  const filteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()))
    : posts;

  return (
    <div className="feed-stream-col">
      {/* 1. Facebook Stories Carousel */}
      <StoriesBar
        stories={stories}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
      />

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
              Filtered by #{selectedTag}
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

      {/* 2. Interactive Create Post Box */}
      <form className="create-post-card" onSubmit={handlePublish}>
        <div className="create-post-header">
          <img
            src={currentUser?.avatar || '/images/app_icon.webp'}
            alt="User avatar"
            className="create-avatar"
          />
          <textarea
            className="create-textarea"
            placeholder={
              currentUser
                ? `What's on your mind, ${currentUser.displayName.split(' ')[0]}?`
                : "Sign in to share updates with Tambayan..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {attachedWebP && (
          <div className="create-image-preview-box">
            <img src={attachedWebP} alt="Post preview (.webp)" className="create-image-preview" />
            <button
              type="button"
              className="remove-img-btn"
              onClick={() => setAttachedWebP(null)}
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="create-post-footer">
          <div className="create-post-tools">
            <label className="tool-chip" style={{ cursor: 'pointer' }}>
              <ImageIcon size={16} color="var(--secondary)" />
              <span>{isProcessingImg ? 'Converting to .webp...' : 'Photo (.webp)'}</span>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImagePick}
                disabled={isProcessingImg}
              />
            </label>

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
            disabled={(!content.trim() && !attachedWebP) || isProcessingImg}
          >
            Post
          </button>
        </div>
      </form>

      {/* 3. Real-time Live Posts List */}
      {filteredPosts.length === 0 ? (
        <div
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <img
            src="/images/app_icon.webp"
            alt="Tambayan"
            style={{ width: '64px', height: '64px', opacity: 0.8, marginBottom: '16px' }}
          />
          <h3 style={{ fontSize: '18px', fontWeight: 800 }}>No posts yet in this feed</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '380px', margin: '8px auto 20px' }}>
            Be the very first one to publish a post, share a campus story, or start a discussion!
          </p>
          {!currentUser ? (
            <button className="btn-create-post" onClick={onOpenAuth} style={{ margin: '0 auto' }}>
              Sign In to Post
            </button>
          ) : null}
        </div>
      ) : (
        filteredPosts.map((post) => {
          const userReaction = currentUser ? post.userReactions[currentUser.uid] : undefined;
          const isCommentsOpen = openCommentsPostId === post.id;

          return (
            <article key={post.id} className="post-card">
              {/* Author Header */}
              <div className="post-author-row">
                <div className="post-author-meta">
                  <img src={post.authorAvatar} alt={post.authorName} className="post-author-avatar" />
                  <div className="post-author-names">
                    <span className="author-title">{post.authorName}</span>
                    <span className="author-handle-time">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
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

              {/* Image (.webp) */}
              {post.imageWebP && (
                <div className="post-media-container">
                  <img src={post.imageWebP} alt="Post asset" className="post-media-img" loading="lazy" />
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

              {/* Action Bar with Facebook Reactions */}
              <div className="post-action-bar">
                <ReactionsBar
                  currentReaction={userReaction}
                  reactions={post.reactions}
                  onSelectReaction={(type) => {
                    if (!currentUser) {
                      onOpenAuth();
                      return;
                    }
                    onToggleReaction(post.id, type, post);
                  }}
                />

                <button
                  className="post-action-btn"
                  onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                >
                  <MessageCircle size={18} />
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
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

              {/* Threaded Nested Comments */}
              {isCommentsOpen && (
                <CommentThread
                  comments={post.comments || []}
                  postId={post.id}
                  currentUser={currentUser}
                  onAddComment={onAddComment}
                  onOpenAuth={onOpenAuth}
                />
              )}
            </article>
          );
        })
      )}
    </div>
  );
};
