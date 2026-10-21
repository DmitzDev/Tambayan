import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onCreatePost: (content: string, image?: string, privacy?: 'Public' | 'Friends' | 'Only me') => void;
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

  if (!isOpen) return null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage) return;

    onCreatePost(content.trim(), attachedImage || undefined, privacy);
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
            <span>Create Campus Post</span>
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
                  <option value="Public">🌍 Public to Campus</option>
                  <option value="Friends">👥 Friends Only</option>
                  <option value="Only me">🔒 Only Me</option>
                </select>
              </div>
            </div>

            <textarea
              className="create-textarea"
              placeholder="Share thoughts, upcoming campus events, or discussion topics..."
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

            <div style={{ display: 'flex', gap: '10px' }}>
              <label className="tool-chip" style={{ cursor: 'pointer' }}>
                <ImageIcon size={16} color="var(--secondary)" />
                <span>Upload Photo (.webp)</span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImagePick} />
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="tool-chip" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create-post"
              disabled={!content.trim() && !attachedImage}
            >
              Publish Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
