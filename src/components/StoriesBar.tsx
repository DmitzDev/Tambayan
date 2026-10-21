import React, { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Story, UserAccount } from '../types';
import { convertToWebP } from '../utils/webpConverter';
import { RealtimeService } from '../services/realtimeService';

interface StoriesBarProps {
  stories: Story[];
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenAuth,
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance story timer
  useEffect(() => {
    if (activeStoryIndex === null) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // 5 seconds total (100 / 2 * 100ms)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const handleStoryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    setIsUploading(true);
    try {
      const webpDataUri = await convertToWebP(file, 1080, 1920, 0.85);
      await RealtimeService.createStory(currentUser, webpDataUri);
    } catch (err: any) {
      alert(err.message || 'Could not upload story');
    } finally {
      setIsUploading(false);
    }
  };

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        className="stories-scroll-row"
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {/* Create Story Card */}
        <label
          style={{
            minWidth: '115px',
            height: '190px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            flexShrink: 0,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img
            src={currentUser?.avatar || '/images/app_icon.webp'}
            alt="My avatar"
            style={{ width: '100%', height: '130px', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--surface-card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Plus size={18} strokeWidth={3} />
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '8px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-main)' }}>
              {isUploading ? 'Uploading...' : 'Create Story'}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleStoryFile}
            disabled={isUploading}
          />
        </label>

        {/* Real-time Active Stories */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            style={{
              minWidth: '115px',
              height: '190px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={story.imageWebP}
              alt="Story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Dark overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
              }}
            />
            {/* Story Avatar Ring */}
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                padding: '2px',
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              }}
            >
              <img
                src={story.authorAvatar}
                alt={story.authorName}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            {/* Story Author Name */}
            <span
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                right: '8px',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: 1.2,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {story.authorName}
            </span>
          </div>
        ))}
      </div>

      {/* Fullscreen Story Viewer Modal */}
      {activeStory && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveStoryIndex(null)}
          style={{ background: 'rgba(0,0,0,0.92)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              height: '80vh',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#000',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Progress Bar */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                height: '3px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                zIndex: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: '#FFF',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            {/* Author info header */}
            <div
              style={{
                position: 'absolute',
                top: '22px',
                left: '16px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={activeStory.authorAvatar}
                  alt={activeStory.authorName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ color: '#FFF', fontWeight: 700, fontSize: '13px' }}>
                  {activeStory.authorName}
                </span>
              </div>
              <button
                onClick={() => setActiveStoryIndex(null)}
                style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Image */}
            <img
              src={activeStory.imageWebP}
              alt="Story Content"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Nav Arrows */}
            {activeStoryIndex !== null && activeStoryIndex > 0 && (
              <button
                onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {activeStoryIndex !== null && activeStoryIndex < stories.length - 1 && (
              <button
                onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
