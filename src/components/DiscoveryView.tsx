import React, { useState } from 'react';
import { Users, UserPlus, Check, Sparkles } from 'lucide-react';
import { Community, LocalProfile } from '../types';

interface DiscoveryViewProps {
  communities: Community[];
  onToggleJoinCommunity: (id: string) => void;
  locals: LocalProfile[];
  onToggleConnectLocal: (id: string) => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  communities,
  onToggleJoinCommunity,
  locals,
  onToggleConnectLocal,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'communities' | 'locals'>('all');

  return (
    <div className="feed-stream-col">
      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: '🌟 All Discoveries' },
          { id: 'communities', label: '👥 Student Communities' },
          { id: 'locals', label: '🤝 Meet Campus Locals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className="tool-chip"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: filterCategory === tab.id ? 'var(--primary)' : 'var(--bg-subtle)',
              color: filterCategory === tab.id ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 700,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Student Communities Showcase */}
      {(filterCategory === 'all' || filterCategory === 'communities') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="var(--primary)" />
              <span>Campus Communities</span>
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {communities.length} Active Hubs
            </span>
          </div>

          <div className="explore-grid">
            {communities.map((comm) => (
              <div key={comm.id} className="community-card">
                <img
                  src={comm.image}
                  alt={comm.name}
                  className="community-card-banner"
                  loading="lazy"
                />
                <div className="community-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 className="community-card-title">{comm.name}</h4>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: comm.color,
                        background: 'var(--bg-subtle)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {comm.tag}
                    </span>
                  </div>

                  <p className="community-card-desc">{comm.description}</p>

                  <div className="community-card-footer">
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {comm.membersCount}
                    </span>

                    <button
                      className={`btn-join-hangout ${comm.isMember ? 'joined' : ''}`}
                      onClick={() => onToggleJoinCommunity(comm.id)}
                    >
                      {comm.isMember ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={12} /> Joined
                        </span>
                      ) : (
                        'Join Hub'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Meet Campus Locals */}
      {(filterCategory === 'all' || filterCategory === 'locals') && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--secondary)" />
              <span>Meet Campus Locals & Creators</span>
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {locals.map((loc) => (
              <div
                key={loc.id}
                style={{
                  background: 'var(--surface-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={loc.avatar}
                    alt={loc.name}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--border-color)',
                    }}
                  />
                  {loc.isOnline && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--success)',
                        border: '2px solid var(--surface-card)',
                      }}
                      title="Online now"
                    />
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800 }}>{loc.name}</h4>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--primary)',
                      fontWeight: 700,
                    }}
                  >
                    {loc.role}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {loc.bio}
                </p>

                <button
                  className={`btn-join-hangout ${loc.isConnected ? 'joined' : ''}`}
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => onToggleConnectLocal(loc.id)}
                >
                  {loc.isConnected ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Check size={14} /> Connected
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <UserPlus size={14} /> Connect
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
