import React, { useState } from 'react';
import { ReactionType } from '../types';

interface ReactionsBarProps {
  currentReaction?: ReactionType;
  onSelectReaction: (type: ReactionType) => void;
  reactions: Record<ReactionType, number>;
}

export const REACTION_CONFIG: Record<
  ReactionType,
  { emoji: string; label: string; color: string }
> = {
  like: { emoji: '👍', label: 'Like', color: '#1877F2' },
  love: { emoji: '❤️', label: 'Love', color: '#FA383E' },
  haha: { emoji: '😆', label: 'Haha', color: '#F7B125' },
  wow: { emoji: '😮', label: 'Wow', color: '#F7B125' },
  sad: { emoji: '😢', label: 'Sad', color: '#F7B125' },
  angry: { emoji: '😡', label: 'Angry', color: '#E94825' },
};

export const ReactionsBar: React.FC<ReactionsBarProps> = ({
  currentReaction,
  onSelectReaction,
  reactions,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  let hoverTimeout: any;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setShowPicker(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setShowPicker(false);
    }, 250);
  };

  let touchTimeout: any;
  const handleTouchStart = () => {
    touchTimeout = setTimeout(() => {
      setShowPicker(true);
    }, 350);
  };

  const handleTouchEnd = () => {
    clearTimeout(touchTimeout);
  };

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  // Reaction badge icons
  const activeEmojis = (Object.keys(reactions) as ReactionType[])
    .filter((k) => reactions[k] > 0)
    .sort((a, b) => reactions[b] - reactions[a])
    .slice(0, 3)
    .map((k) => REACTION_CONFIG[k].emoji);

  return (
    <div
      className="reaction-button-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Floating Facebook Reactions Popup Bar */}
      {showPicker && (
        <div
          className="reactions-popup-dock"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '0',
            marginBottom: '8px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: '999px',
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 100,
            animation: 'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {(Object.keys(REACTION_CONFIG) as ReactionType[]).map((type) => {
            const item = REACTION_CONFIG[type];
            return (
              <button
                key={type}
                className="reaction-emoji-btn"
                onClick={() => {
                  onSelectReaction(type);
                  setShowPicker(false);
                }}
                title={item.label}
                style={{
                  fontSize: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  padding: '2px 4px',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.35) translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
              >
                {item.emoji}
              </button>
            );
          })}
        </div>
      )}

      {/* Trigger Button */}
      <button
        className={`post-action-btn ${currentReaction ? 'liked' : ''}`}
        onClick={() => onSelectReaction(currentReaction || 'like')}
        style={{
          color: currentReaction ? REACTION_CONFIG[currentReaction].color : undefined,
        }}
      >
        <span style={{ fontSize: '18px', lineHeight: 1 }}>
          {currentReaction ? REACTION_CONFIG[currentReaction].emoji : '👍'}
        </span>
        <span>
          {currentReaction ? REACTION_CONFIG[currentReaction].label : 'Like'}
        </span>

        {/* Reaction Breakdown pills */}
        {totalReactions > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              marginLeft: '4px',
              fontWeight: 700,
            }}
          >
            {activeEmojis.join('')} {totalReactions}
          </span>
        )}
      </button>
    </div>
  );
};
