import React from 'react';
import { X, Calendar, MapPin, Users, Ticket, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({ isOpen, onClose }) => {
  const [registered, setRegistered] = React.useState(false);

  if (!isOpen) return null;

  const handleRegister = () => {
    setRegistered(true);
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#FC7847', '#15616C', '#E5A93C'],
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src="/images/spotlight_flea.webp"
            alt="Weekend Flea Market"
            style={{ width: '100%', height: '240px', objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.6)',
              color: '#FFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '14px' }}>
          <span className="spotlight-tag" style={{ alignSelf: 'flex-start' }}>Featured Event</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Weekend Flea Market & Campus Fair</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
            Join over 50 student makers, artisan coffee roasters, vintage thrifters, and indie game
            developers for a celebration of local youth craft. Live acoustic performances throughout the afternoon!
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'var(--bg-subtle)',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Calendar size={18} color="var(--primary)" />
              <div>
                <strong>Saturday, Oct 24</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>10:00 AM – 8:00 PM</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <MapPin size={18} color="var(--secondary)" />
              <div>
                <strong>UP Sunken Garden</strong>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Open Grounds & Grandstand</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="tool-chip" onClick={onClose}>
            Close
          </button>
          <button
            className={`btn-create-post ${registered ? 'btn-join-hangout joined' : ''}`}
            onClick={handleRegister}
          >
            <Ticket size={16} />
            <span>{registered ? 'Registered ✓' : 'Register for Free Pass'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
