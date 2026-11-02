import React, { useState } from 'react';
import {
  Image as ImageIcon,
  MessageCircle,
  Share2,
  Globe,
  Users,
  Lock,
  Bookmark,
  Trash2,
  Check,
  X,
  Sparkles,
  Flame,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Post, UserAccount, ReactionType, Story } from '../types';
import { ReactionsBar } from './ReactionsBar';
import { CommentThread } from './CommentThread';
import { StoriesBar } from './StoriesBar';
import { convertToWebP } from '../utils/webpConverter';
import { formatRelativeTime } from '../utils/timeUtils';

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
  onDeletePost?: (postId: string) => void;
  savedPostIds?: string[];
  onToggleSavePost?: (postId: string) => void;
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
  onDeletePost,
  savedPostIds = [],
  onToggleSavePost,
  onOpenAuth,
  selectedTag,
  onSelectTag,
}) => {
  const [content, setContent] = useState('');
  const [attachedWebP, setAttachedWebP] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

  const tagFilteredPosts = selectedTag
    ? posts.filter((p) => p.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase()))
    : posts;

  const filteredPosts = [...tagFilteredPosts].sort((a, b) => {
    if (sortBy === 'popular') {
      const scoreA =
        Object.values(a.reactions || {}).reduce((acc, v) => acc + v, 0) +
        (a.comments ? a.comments.length * 2 : 0);
      const scoreB =
        Object.values(b.reactions || {}).reduce((acc, v) => acc + v, 0) +
        (b.comments ? b.comments.length * 2 : 0);
      return scoreB - scoreA;
    }
    return b.createdAt - a.createdAt;
  });

  const handleSharePost = (postId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedPostId(postId);
    setTimeout(() => {
      setCopiedPostId((prev) => (prev === postId ? null : prev));
    }, 2200);
  };

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
                ? `What's on your mind, ${currentUser.displayName.split(' ')[0]}? (Use #tags to categorize)`
                : 'Sign in to share updates with Tambayan...'
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
          <div className="create-post-tools" style={{ flexWrap: 'wrap' }}>
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

      {/* Feed Sort Header */}
      {filteredPosts.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 4px',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            News Feed ({filteredPosts.length})
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setSortBy('latest')}
              className={`sort-pill-btn ${sortBy === 'latest' ? 'active' : ''}`}
            >
              <Clock size={13} />
              <span>Latest</span>
            </button>
            <button
              type="button"
              onClick={() => setSortBy('popular')}
              className={`sort-pill-btn ${sortBy === 'popular' ? 'active' : ''}`}
            >
              <Flame size={13} />
              <span>Top Activity</span>
            </button>
          </div>
        </div>
      )}

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
            Be the first to share an update, post a photo, or start a conversation with everyone!
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
          const isSaved = savedPostIds.includes(post.id);
          const isOwner = currentUser?.uid && currentUser.uid === post.authorId;

          return (
            <article key={post.id} className="post-card">
              {/* Author Header */}
              <div className="post-author-row">
                <div className="post-author-meta">
                  <img src={post.authorAvatar} alt={post.authorName} className="post-author-avatar" />
                  <div className="post-author-names">
                    <span className="author-title">{post.authorName}</span>
                    <span className="author-handle-time">
                      {formatRelativeTime(post.createdAt)} •{' '}
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

                {/* Right Action Icons (Bookmark & Owner Delete) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {onToggleSavePost && (
                    <button
                      type="button"
                      className={`post-icon-action ${isSaved ? 'active' : ''}`}
                      onClick={() => onToggleSavePost(post.id)}
                      title={isSaved ? 'Remove from Saved' : 'Bookmark Post'}
                    >
                      <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  )}

                  {isOwner && onDeletePost && (
                    <button
                      type="button"
                      className="post-icon-action danger"
                      onClick={() => onDeletePost(post.id)}
                      title="Delete your post"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="post-content-text">{post.content}</p>

              {/* Image (.webp) with Lightbox */}
              {post.imageWebP && (
                <div
                  className="post-media-container"
                  onClick={() => setLightboxImage(post.imageWebP || null)}
                  style={{ cursor: 'zoom-in' }}
                >
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
                  className={`post-action-btn ${isCommentsOpen ? 'liked' : ''}`}
                  onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                >
                  <MessageCircle size={18} />
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
                </button>

                <button
                  className="post-action-btn"
                  onClick={() => handleSharePost(post.id)}
                >
                  {copiedPostId === post.id ? (
                    <>
                      <Check size={18} color="var(--success)" />
                      <span style={{ color: 'var(--success)' }}>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={18} />
                      <span>Share</span>
                    </>
                  )}
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

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div
          className="modal-backdrop"
          onClick={() => setLightboxImage(null)}
          style={{ background: 'rgba(0, 0, 0, 0.88)', zIndex: 1100 }}
        >
          <div
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="Enlarged photo"
              style={{
                maxWidth: '90vw',
                maxHeight: '88vh',
                borderRadius: 'var(--radius-md)',
                objectFit: 'contain',
                boxShadow: 'var(--shadow-lg)',
              }}
            />
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-14px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
              }}
              title="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
