import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus, ChevronUp } from 'lucide-react';
import { ChatMessage, UserAccount } from '../types';
import { RealtimeService } from '../services/realtimeService';

interface MessengerDockProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const MessengerDock: React.FC<MessengerDockProps> = ({
  currentUser,
  onOpenAuth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to General Campus Lounge room
  useEffect(() => {
    const unsubscribe = RealtimeService.subscribeMessages('campus_lounge', (liveMsgs) => {
      setMessages(liveMsgs);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const msg = text.trim();
    setText('');
    await RealtimeService.sendMessage('campus_lounge', currentUser, msg);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '24px',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Floating Messenger Icon Bubble if closed */}
      {!isOpen ? (
        <button
          onClick={() => {
            if (!currentUser) onOpenAuth();
            setIsOpen(true);
            setIsMinimized(false);
          }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Open Campus Messenger"
        >
          <MessageCircle size={28} />
        </button>
      ) : (
        /* Expanded Floating Messenger Box */
        <div
          style={{
            width: '320px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 14px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#4ADE80',
                  boxShadow: '0 0 6px #4ADE80',
                }}
              />
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Campus Chat Lounge</span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {isMinimized ? <ChevronUp size={16} /> : <Minus size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body if not minimized */}
          {!isMinimized && (
            <>
              <div
                style={{
                  height: '280px',
                  overflowY: 'auto',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  background: 'var(--bg-canvas)',
                }}
              >
                {messages.length === 0 ? (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 'auto' }}>
                    Say hello to students online!
                  </p>
                ) : (
                  messages.map((m) => {
                    const isMe = currentUser?.uid === m.senderId;
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          flexDirection: isMe ? 'row-reverse' : 'row',
                          gap: '6px',
                          alignItems: 'flex-end',
                        }}
                      >
                        <img
                          src={m.senderAvatar}
                          alt={m.senderName}
                          style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div
                          style={{
                            maxWidth: '75%',
                            padding: '6px 10px',
                            borderRadius: '14px',
                            fontSize: '12px',
                            background: isMe ? 'var(--primary)' : 'var(--surface-card)',
                            color: isMe ? '#FFF' : 'var(--text-main)',
                            border: isMe ? 'none' : '1px solid var(--border-color)',
                          }}
                        >
                          {!isMe && (
                            <strong style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>
                              {m.senderName}
                            </strong>
                          )}
                          <span>{m.text}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSend}
                style={{
                  padding: '8px 10px',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '6px',
                  background: 'var(--surface-card)',
                }}
              >
                <input
                  type="text"
                  placeholder={currentUser ? 'Send a message...' : 'Sign in to chat...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-subtle)',
                    fontSize: '12px',
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
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: text.trim() ? 1 : 0.5,
                  }}
                >
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
