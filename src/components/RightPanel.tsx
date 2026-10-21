import React from 'react';
import { Flame, Sparkles, TrendingUp, Calendar, Check } from 'lucide-react';
import { Hangout } from '../types';

interface RightPanelProps {
  hangouts: Hangout[];
  onToggleJoinHangout: (id: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onOpenSpotlight: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  hangouts,
  onToggleJoinHangout,
  selectedTag,
  onSelectTag,
  onOpenSpotlight,
}) => {
  const trendingTags = [
    { tag: 'UPDiliman', posts: '1.2k posts' },
    { tag: 'CoffeeLovers', posts: '850 posts' },
    { tag: 'StreetArt', posts: '430 posts' },
    { tag: 'MidnightCoffee', posts: '310 posts' },
    { tag: 'ArchitectureFolio', posts: '220 posts' },
  ];

  return (
    <aside className="right-panel-col">
      {/* Featured Spotlight Card */}
      <div className="panel-widget" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="widget-title">
            <Sparkles size={18} color="var(--primary)" />
            <span>Spotlight Event</span>
          </span>
          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
            Tomorrow
          </span>
        </div>

        <div className="spotlight-card" onClick={onOpenSpotlight} style={{ cursor: 'pointer' }}>
          <img
            src="/images/spotlight_flea.webp"
            alt="Weekend Flea Market"
            className="spotlight-image"
          />
          <div className="spotlight-overlay">
            <span className="spotlight-tag">Community Market</span>
            <h4 className="spotlight-name">Weekend Flea Market</h4>
            <p className="spotlight-sub">Hosted by Local Makers • 50+ Vendors</p>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Join us this Saturday for local craft, live acoustic music, and the best artisan coffee
          trucks on campus!
        </p>
      </div>

      {/* Active Hangouts Lounge */}
      <div className="panel-widget">
        <span className="widget-title">
          <Flame size={18} color="var(--primary)" />
          <span>Live Hangouts</span>
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hangouts.map((h) => (
            <div key={h.id} className="hangout-mini-item">
              <img src={h.image} alt={h.title} className="hangout-mini-thumb" />
              <div className="hangout-mini-meta">
                <h5 className="hangout-mini-name">{h.title}</h5>
                <div className="hangout-live-indicator">
                  <span className="live-pulse" />
                  <span>{h.activeCount} active now</span>
                </div>
              </div>
              <button
                className={`btn-join-hangout ${h.isJoined ? 'joined' : ''}`}
                onClick={() => onToggleJoinHangout(h.id)}
              >
                {h.isJoined ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> In
                  </span>
                ) : (
                  'Join'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Campus Topics */}
      <div className="panel-widget">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="widget-title">
            <TrendingUp size={18} color="var(--secondary)" />
            <span>Trending Tags</span>
          </span>
          {selectedTag && (
            <button
              onClick={() => onSelectTag(null)}
              style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {trendingTags.map((t) => {
            const isSelected = selectedTag === t.tag;
            return (
              <div
                key={t.tag}
                onClick={() => onSelectTag(isSelected ? null : t.tag)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '13px',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    }}
                  >
                    #{t.tag}
                  </span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.posts}</p>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: 700,
                  }}
                >
                  Explore →
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
