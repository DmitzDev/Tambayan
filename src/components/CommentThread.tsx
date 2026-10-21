import React, { useState } from 'react';
import { Send, CornerDownRight, X } from 'lucide-react';
import { CommentItem, UserAccount } from '../types';

interface CommentThreadProps {
  comments: CommentItem[];
  postId: string;
  currentUser: UserAccount | null;
  onAddComment: (postId: string, text: string, parentId?: string | null) => void;
  onOpenAuth: () => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  postId,
  currentUser,
  onAddComment,
  onOpenAuth,
}) => {
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    onAddComment(postId, text.trim(), replyingTo ? replyingTo.id : null);
    setText('');
    setReplyingTo(null);
  };

  // Group top-level comments and replies
  const topLevel = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
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
      {/* Existing Comments */}
      {topLevel.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No comments yet. Start the conversation!
        </p>
      ) : (
        topLevel.map((comment) => {
          const replies = getReplies(comment.id);
          return (
            <div key={comment.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Parent Comment */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      display: 'inline-block',
                      maxWidth: '100%',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {comment.authorName}
                    </span>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {comment.content}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', marginLeft: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => setReplyingTo(comment)}
                      style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)' }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* Nested Replies */}
              {replies.length > 0 && (
                <div style={{ marginLeft: '36px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {replies.map((reply) => (
                    <div key={reply.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <CornerDownRight size={14} color="var(--text-muted)" style={{ marginTop: '6px' }} />
                      <img
                        src={reply.authorAvatar}
                        alt={reply.authorName}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '6px 10px',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700 }}>{reply.authorName}</span>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Reply Banner if active */}
      {replyingTo && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--primary-light)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          <span>Replying to {replyingTo.authorName}</span>
          <button onClick={() => setReplyingTo(null)} style={{ color: 'var(--primary)' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder={replyingTo ? `Reply to ${replyingTo.authorName}...` : 'Write a comment...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
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
          type="submit"
          disabled={!text.trim()}
          style={{
            background: 'var(--primary)',
            color: '#FFF',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            opacity: text.trim() ? 1 : 0.6,
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
