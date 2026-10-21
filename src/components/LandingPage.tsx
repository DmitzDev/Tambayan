import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { X, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { auth } from '../config/firebase';

interface LandingPageProps {
  onLoginSuccess: () => void;
  onExploreGuest?: () => void;
}

interface SavedLogin {
  email: string;
  name: string;
  avatar: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess, onExploreGuest }) => {
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sign up modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [birthMonth, setBirthMonth] = useState('Oct');
  const [birthDay, setBirthDay] = useState('21');
  const [birthYear, setBirthYear] = useState('2004');
  const [gender, setGender] = useState('female');
  const [campus, setCampus] = useState('UP Diliman');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Saved recent logins (like Facebook's recent logins feature)
  const [savedLogins, setSavedLogins] = useState<SavedLogin[]>(() => {
    try {
      const stored = localStorage.getItem('tambayan_saved_logins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Save to recent logins
      const newSaved: SavedLogin = {
        email: cred.user.email || email.trim(),
        name: cred.user.displayName || email.split('@')[0],
        avatar: cred.user.photoURL || '/images/app_icon.webp',
      };
      const updated = [newSaved, ...savedLogins.filter((s) => s.email !== newSaved.email)].slice(0, 3);
      setSavedLogins(updated);
      localStorage.setItem('tambayan_saved_logins', JSON.stringify(updated));
      onLoginSuccess();
    } catch (err: any) {
      setLoginError(err.message || 'Incorrect email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (saved: SavedLogin) => {
    setEmail(saved.email);
  };

  const handleRemoveSaved = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation();
    const updated = savedLogins.filter((s) => s.email !== emailToRemove);
    setSavedLogins(updated);
    localStorage.setItem('tambayan_saved_logins', JSON.stringify(updated));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setIsSigningUp(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (!fullName) throw new Error('Please enter your full name');

      const cred = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      await updateProfile(cred.user, {
        displayName: fullName,
        photoURL: '/images/app_icon.webp',
      });

      // Save to recent logins
      const newSaved: SavedLogin = {
        email: regEmail.trim(),
        name: fullName,
        avatar: '/images/app_icon.webp',
      };
      const updated = [newSaved, ...savedLogins.filter((s) => s.email !== newSaved.email)].slice(0, 3);
      setSavedLogins(updated);
      localStorage.setItem('tambayan_saved_logins', JSON.stringify(updated));

      setIsSignUpOpen(false);
      onLoginSuccess();
    } catch (err: any) {
      setSignUpError(err.message || 'Registration failed. Email might already be registered.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const years = Array.from({ length: 50 }, (_, i) => (2026 - i).toString());

  return (
    <div className="fb-landing-container">
      <div className="fb-landing-main">
        {/* Left Side: Brand & Recent Logins */}
        <div className="fb-left-pane">
          <div className="fb-brand-header">
            <div className="fb-logo-lockup">
              <img src="/images/app_icon.webp" alt="Tambayan" className="fb-brand-icon" />
              <h1 className="fb-brand-wordmark">Tambayan</h1>
            </div>
            <p className="fb-tagline">
              Connect with classmates, join university tambayans, and share what's happening on your campus in real time.
            </p>
          </div>

          {/* Facebook-style Recent Logins Section */}
          {savedLogins.length > 0 ? (
            <div className="fb-recent-logins">
              <h4 className="fb-recent-title">Recent Logins</h4>
              <p className="fb-recent-sub">Click your picture or add an account.</p>

              <div className="fb-recent-cards-row">
                {savedLogins.map((saved) => (
                  <div
                    key={saved.email}
                    className="fb-recent-card"
                    onClick={() => handleQuickLogin(saved)}
                  >
                    <button
                      className="fb-remove-recent-btn"
                      onClick={(e) => handleRemoveSaved(e, saved.email)}
                      title="Remove account from this page"
                    >
                      <X size={14} />
                    </button>
                    <img src={saved.avatar} alt={saved.name} className="fb-recent-avatar" />
                    <span className="fb-recent-name">{saved.name}</span>
                  </div>
                ))}

                <div className="fb-recent-add-card" onClick={() => setIsSignUpOpen(true)}>
                  <div className="fb-add-circle">
                    <Plus size={24} color="var(--primary)" />
                  </div>
                  <span className="fb-add-text">Add Account</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Side: Login Card */}
        <div className="fb-right-pane">
          <div className="fb-login-card">
            {loginError && (
              <div className="fb-error-banner">
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="fb-login-form">
              <input
                type="text"
                placeholder="Email address or student number"
                className="fb-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="fb-input"
                  style={{ paddingRight: '40px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="fb-pw-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" className="fb-btn-login" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>

              <a
                href="#forgot"
                className="fb-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('To reset your password, please contact the Tambayan student portal administrator.');
                }}
              >
                Forgotten password?
              </a>

              <div className="fb-divider" />

              <button
                type="button"
                className="fb-btn-create-account"
                onClick={() => {
                  setSignUpError(null);
                  setIsSignUpOpen(true);
                }}
              >
                Create new account
              </button>
            </form>
          </div>

          <div className="fb-create-page-note">
            <a href="#create-page" onClick={(e) => { e.preventDefault(); setIsSignUpOpen(true); }}>
              <strong>Create a Tambayan</strong>
            </a>{' '}
            for a student council, fraternity, club, or campus org.
          </div>

          {onExploreGuest && (
            <button
              type="button"
              className="fb-guest-explore-btn"
              onClick={onExploreGuest}
            >
              Explore Tambayan as Guest →
            </button>
          )}
        </div>
      </div>

      {/* Facebook-style Sign Up Modal */}
      {isSignUpOpen && (
        <div className="modal-backdrop" onClick={() => setIsSignUpOpen(false)}>
          <div className="fb-signup-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="fb-signup-header">
              <div>
                <h2 className="fb-signup-title">Sign Up</h2>
                <p className="fb-signup-subtitle">It's quick and easy.</p>
              </div>
              <button className="fb-close-modal-btn" onClick={() => setIsSignUpOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="fb-divider" style={{ margin: 0 }} />

            {signUpError && (
              <div className="fb-error-banner" style={{ margin: '14px 16px 0' }}>
                <span>{signUpError}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="fb-signup-form">
              {/* Names row */}
              <div className="fb-form-row">
                <input
                  type="text"
                  placeholder="First name"
                  className="fb-input-sm"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="fb-input-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <input
                type="email"
                placeholder="Student email address"
                className="fb-input-sm"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="New password (at least 6 characters)"
                className="fb-input-sm"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
                minLength={6}
              />

              {/* Campus select */}
              <div>
                <label className="fb-field-label">University / Campus</label>
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="fb-input-sm"
                >
                  <option value="UP Diliman">UP Diliman</option>
                  <option value="UP Manila">UP Manila</option>
                  <option value="Ateneo de Manila">Ateneo de Manila University</option>
                  <option value="De La Salle University">De La Salle University</option>
                  <option value="UST Manila">University of Santo Tomas</option>
                  <option value="Polytechnic University of the Philippines">PUP Manila</option>
                  <option value="Mapua University">Mapúa University</option>
                  <option value="Other Campus">Other University / College</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="fb-field-label">Date of birth</label>
                <div className="fb-form-row">
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="fb-select-sm"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="fb-select-sm"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="fb-select-sm"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender radio buttons */}
              <div>
                <label className="fb-field-label">Gender</label>
                <div className="fb-form-row">
                  <label className="fb-radio-pill">
                    <span>Female</span>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={() => setGender('female')}
                    />
                  </label>
                  <label className="fb-radio-pill">
                    <span>Male</span>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={() => setGender('male')}
                    />
                  </label>
                  <label className="fb-radio-pill">
                    <span>Custom</span>
                    <input
                      type="radio"
                      name="gender"
                      value="custom"
                      checked={gender === 'custom'}
                      onChange={() => setGender('custom')}
                    />
                  </label>
                </div>
              </div>

              <p className="fb-policy-text">
                People who use our service may have uploaded your campus contact info to Tambayan.{' '}
                <a href="#terms">Learn more</a>.
              </p>

              <p className="fb-policy-text">
                By clicking Sign Up, you agree to our <a href="#terms">Terms</a>,{' '}
                <a href="#privacy">Privacy Policy</a> and <a href="#cookies">Cookies Policy</a>.
              </p>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="submit" className="fb-btn-submit-signup" disabled={isSigningUp}>
                  {isSigningUp ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Iconic Facebook Footer */}
      <footer className="fb-footer">
        <div className="fb-footer-inner">
          <div className="fb-languages-row">
            <span>English (UK)</span>
            <a href="#fil">Filipino</a>
            <a href="#ceb">Bisaya</a>
            <a href="#ilo">Ilokano</a>
            <a href="#es">Español</a>
            <a href="#ja">日本語</a>
            <a href="#ko">한국어</a>
            <a href="#zh">中文(简体)</a>
            <a href="#ar">العربية</a>
            <button className="fb-add-lang-btn">+</button>
          </div>

          <div className="fb-footer-line" />

          <div className="fb-links-grid">
            <a href="#signup" onClick={(e) => { e.preventDefault(); setIsSignUpOpen(true); }}>Sign Up</a>
            <a href="#login">Log In</a>
            <a href="#messenger">Messenger</a>
            <a href="#tambayanlite">Tambayan Lite</a>
            <a href="#video">Video</a>
            <a href="#places">Campuses</a>
            <a href="#groups">Tambayans</a>
            <a href="#marketplace">Marketplace</a>
            <a href="#pay">Tambayan Pay</a>
            <a href="#events">Campus Events</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
            <a href="#help">Help Center</a>
            <a href="#developers">Developers</a>
            <a href="#careers">Careers</a>
          </div>

          <div className="fb-copyright">
            Tambayan Platforms © 2026 • Crafted with pride for Filipino students & campus communities
          </div>
        </div>
      </footer>
    </div>
  );
};
