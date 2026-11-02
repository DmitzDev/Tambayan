import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { convertToWebP } from '../utils/webpConverter';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onCreatePost: (
    content: string,
    image?: string,
    privacy?: 'Public' | 'Friends' | 'Only me',
    tags?: string[]
  ) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  user,
  onCreatePost,
}) => {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');
  const [isProcessingImg, setIsProcessingImg] = useState(false);

  if (!isOpen) return null;

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImg(true);
      try {
        const webp = await convertToWebP(file, 1200, 1200, 0.82);
        setAttachedImage(webp);
      } catch {
        // Fallback silent or ignore
      } finally {
        setIsProcessingImg(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage) return;

    const tags = content.match(/#[a-zA-Z0-9_]+/g)?.map((t) => t.substring(1)) || [];
    onCreatePost(content.trim(), attachedImage || undefined, privacy, tags);
    setContent('');
    setAttachedImage(null);
    onClose();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FC7847', '#15616C', '#E5A93C'],
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>Create Post</span>
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{user.name}</h4>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="tool-chip"
                  style={{ border: 'none', padding: '2px 8px', fontSize: '11px' }}
                >
                  <option value="Public">🌍 Public</option>
                  <option value="Friends">👥 Friends</option>
                  <option value="Only me">🔒 Only Me</option>
                </select>
              </div>
            </div>

            <textarea
              className="create-textarea"
              placeholder="What's on your mind? Share updates, photos, or stories..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoFocus
            />

            {attachedImage && (
              <div className="create-image-preview-box">
                <img src={attachedImage} alt="Post asset preview" className="create-image-preview" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => setAttachedImage(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <label className="tool-chip" style={{ cursor: 'pointer' }}>
                <ImageIcon size={16} color="var(--secondary)" />
                <span>{isProcessingImg ? 'Converting to .webp...' : 'Upload Photo (.webp)'}</span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImagePick}
                  disabled={isProcessingImg}
                />
              </label>

              {['#TambayanPH', '#CoffeeLovers', '#WeekendVibes'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="tool-chip"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                  onClick={() =>
                    setContent((prev) => (prev.includes(tag) ? prev : `${prev} ${tag}`.trim()))
                  }
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="tool-chip" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create-post"
              disabled={(!content.trim() && !attachedImage) || isProcessingImg}
            >
              Publish Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
