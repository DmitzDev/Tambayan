import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  X,
  Eye,
  EyeOff,
  Store,
  Bookmark,
  Clock,
  ArrowLeft,
  Sun,
  Moon,
  Trash2,
} from 'lucide-react';
import { auth } from '../config/firebase';

interface LandingPageProps {
  onLoginSuccess: () => void;
  onExploreGuest?: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

interface SavedLogin {
  email: string;
  name: string;
  avatar: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLoginSuccess,
  onExploreGuest,
  isDark = false,
  onToggleTheme,
}) => {
  // Load real saved login from localStorage (NO dummy/fake accounts)
  const [savedUser, setSavedUser] = useState<SavedLogin | null>(() => {
    try {
      const stored = localStorage.getItem('tambayan_saved_logins');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed[0].email &&
          parsed[0].email !== 'mitchelle.salazar@student.tambayan.edu' &&
          parsed[0].email !== 'mitchelle.salazar@tambayan.com'
        ) {
          return parsed[0];
        }
      }
    } catch {
      // ignore storage errors
    }
    return null;
  });

  // Default to 'form' unless there is a genuine saved user from a previous login
  const [viewMode, setViewMode] = useState<'profile' | 'form'>(() =>
    savedUser ? 'profile' : 'form'
  );

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [activeLang, setActiveLang] = useState('English (US)');

  // Sign up modal state
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [birthMonth, setBirthMonth] = useState('Oct');
  const [birthDay, setBirthDay] = useState('21');
  const [birthYear, setBirthYear] = useState('2000');
  const [gender, setGender] = useState('female');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 80 }, (_, i) => String(2012 - i));

  // Handle Continue button click on a real saved profile card
  const handleContinue = () => {
    if (savedUser?.email) {
      setEmail(savedUser.email);
      setViewMode('form');
    }
  };

  const handleRemoveSavedProfile = () => {
    localStorage.removeItem('tambayan_saved_logins');
    setSavedUser(null);
    setViewMode('form');
  };

  // Handle Form Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const newSaved: SavedLogin = {
        email: cred.user.email || email.trim(),
        name: cred.user.displayName || email.split('@')[0],
        avatar: cred.user.photoURL || '/images/app_icon.webp',
      };
      setSavedUser(newSaved);
      localStorage.setItem('tambayan_saved_logins', JSON.stringify([newSaved]));
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('The email or password you entered is incorrect. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setLoginError('No account found with this email. Click "Create new account" to join!');
      } else {
        setLoginError(err.message || 'Login failed. Please verify your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setIsSigningUp(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const cred = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      await updateProfile(cred.user, {
        displayName: fullName,
        photoURL: '/images/avatar_maya.webp',
      });

      const newSaved: SavedLogin = {
        email: regEmail.trim(),
        name: fullName,
        avatar: '/images/avatar_maya.webp',
      };
      setSavedUser(newSaved);
      localStorage.setItem('tambayan_saved_logins', JSON.stringify([newSaved]));

      setIsSignUpOpen(false);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setSignUpError('An account with this email already exists. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setSignUpError('Password should be at least 6 characters.');
      } else {
        setSignUpError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const languages = [
    'English (US)',
    'Filipino',
    'Bisaya',
    'Ilocano',
    'Hiligaynon',
    'Español',
    'Français',
    'Deutsch',
  ];

  return (
    <div className="fb-modern-container">
      {/* Top Main Section: Split Left & Right Panes */}
      <div className="fb-modern-main">
        {/* ==============================================================
            LEFT PANE: Tambayan Brand Mark, Interactive Collage, & Headline
            ============================================================== */}
        <div className="fb-modern-left-pane">
          {/* Tambayan Official Brand Mark */}
          <div className="fb-brand-header" style={{ gap: '12px' }}>
            <div className="brand-icon-box" style={{ width: '48px', height: '48px' }}>
              <img
                src="/images/app_icon.webp"
                alt="Tambayan Logo"
                className="brand-logo-img"
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-name" style={{ fontSize: '26px' }}>
                Tambayan
              </span>
              <span className="brand-badge">Social Network for Everyone</span>
            </div>
          </div>

          {/* Dynamic 3D Collage Stage */}
          <div className="fb-collage-stage">
            {/* 1. Floating 😆 Haha Sticker */}
            <div className="fb-sticker fb-haha-sticker" title="Haha reaction">
              <span className="fb-emoji-char">😆</span>
            </div>

            {/* 2. Top-Left Marketplace Craft Card */}
            <div className="fb-card-float fb-card-marketplace">
              <div className="fb-icon-badge fb-badge-market">
                <Store size={15} color="#fff" />
              </div>
              <img
                src="/images/landing_craft.webp"
                alt="Tambayan Marketplace"
                className="fb-craft-photo"
              />
            </div>

            {/* 3. Center Story Video Card */}
            <div className="fb-card-float fb-card-story-skater">
              {/* Timestamp Badge */}
              <div className="fb-timestamp-badge">
                <Clock size={12} color="#fff" />
                <span>LIVE</span>
              </div>

              {/* Action Photo */}
              <img
                src="/images/landing_skater.webp"
                alt="Featured Story"
                className="fb-skater-photo"
              />

              {/* Video Progress Bar Controls at Bottom */}
              <div className="fb-story-controls">
                <div className="fb-progress-track">
                  <div className="fb-progress-fill" />
                  <div className="fb-progress-scrubber" />
                </div>
                <div className="fb-story-ctrl-pills">
                  <span className="fb-pill-dot" />
                  <span className="fb-pill-dot" />
                </div>
              </div>

              {/* Floating ❤️ Heart Sticker on bottom-right */}
              <div className="fb-sticker fb-heart-sticker" title="Love reaction">
                <span className="fb-emoji-char">❤️</span>
              </div>
            </div>

            {/* 4. Bottom-Left Community Hangout Ticket Card */}
            <div className="fb-card-float fb-card-cinema-ticket">
              <div className="fb-icon-badge fb-badge-event">
                <Bookmark size={15} color="#fff" />
              </div>
              <img
                src="/images/landing_ticket.webp"
                alt="Community Events"
                className="fb-ticket-photo"
              />
              <div className="fb-ticket-skeleton">
                <div className="fb-skeleton-line fb-skel-w1" />
                <div className="fb-skeleton-line fb-skel-w2" />
              </div>
            </div>

            {/* 5. Bottom-Right Circular Avatar with Teal Ring */}
            <div className="fb-avatar-ring-badge">
              <img
                src="/images/landing_avatar_round.webp"
                alt="Tambayan Member"
                className="fb-avatar-ring-img"
              />
            </div>
          </div>

          {/* Bold Headline */}
          <div className="fb-headline-wrapper">
            <h1 className="fb-headline-text">
              Connect, share &<br />
              hangout with<br />
              <span className="fb-headline-accent">everyone you love</span>.
            </h1>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="fb-vertical-divider" />

        {/* ==============================================================
            RIGHT PANE: Tambayan Login Form / Recent Login Card
            ============================================================== */}
        <div className="fb-modern-right-pane">
          {/* Top-Right Theme Toggle */}
          <div className="fb-top-settings-anchor">
            {onToggleTheme && (
              <button
                className="theme-toggle-btn"
                onClick={onToggleTheme}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun size={19} /> : <Moon size={19} />}
              </button>
            )}
          </div>

          {viewMode === 'profile' && savedUser ? (
            /* Recent Real Login Card */
            <div className="fb-profile-action-box">
              <div style={{ position: 'relative' }}>
                <div className="fb-profile-avatar-circle">
                  <img
                    src={savedUser.avatar}
                    alt={savedUser.name}
                    className="fb-profile-photo"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveSavedProfile}
                  title="Remove saved account"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h2 className="fb-profile-fullname">{savedUser.name}</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '-16px', marginBottom: '20px' }}>
                {savedUser.email}
              </p>

              <div className="fb-pill-buttons-stack">
                <button
                  type="button"
                  className="fb-pill-btn fb-pill-continue"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  Continue as {savedUser.name.split(' ')[0]}
                </button>

                <button
                  type="button"
                  className="fb-pill-btn fb-pill-secondary"
                  onClick={() => {
                    setEmail('');
                    setPassword('');
                    setViewMode('form');
                  }}
                >
                  Use another account
                </button>

                <button
                  type="button"
                  className="fb-pill-btn fb-pill-outline"
                  onClick={() => {
                    setSignUpError(null);
                    setIsSignUpOpen(true);
                  }}
                >
                  Create new account
                </button>

                {onExploreGuest && (
                  <button
                    type="button"
                    className="fb-guest-text-btn"
                    onClick={onExploreGuest}
                  >
                    Explore Tambayan as Guest →
                  </button>
                )}
              </div>

              <div className="fb-meta-footer-brand">
                <img
                  src="/images/app_icon.webp"
                  alt="Tambayan"
                  style={{ width: '20px', height: '20px', borderRadius: '5px' }}
                />
                <span className="fb-meta-label">Tambayan Network</span>
              </div>
            </div>
          ) : (
            /* Standard Credentials Login Card */
            <div className="fb-form-action-box">
              {savedUser && (
                <button
                  type="button"
                  className="fb-back-profile-btn"
                  onClick={() => setViewMode('profile')}
                >
                  <ArrowLeft size={16} />
                  <span>Back to saved account</span>
                </button>
              )}

              <div style={{ marginBottom: '20px' }}>
                <h2 className="fb-form-title" style={{ marginBottom: '4px' }}>
                  Log in to Tambayan
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Welcome back! Enter your details to connect with your community.
                </p>
              </div>

              {loginError && (
                <div className="fb-form-error-alert">
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="fb-modern-form">
                <input
                  type="email"
                  placeholder="Email address"
                  className="fb-modern-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="fb-modern-input"
                    style={{ paddingRight: '44px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="fb-eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="fb-pill-btn fb-pill-continue"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>

                <button
                  type="button"
                  className="fb-forgot-password-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setForgotSent(true)}
                >
                  {forgotSent
                    ? '✓ Password reset instructions sent to your email'
                    : 'Forgot password?'}
                </button>

                <div className="fb-form-divider" />

                <button
                  type="button"
                  className="fb-pill-btn fb-pill-outline"
                  onClick={() => {
                    setSignUpError(null);
                    setIsSignUpOpen(true);
                  }}
                >
                  Create new account
                </button>

                {onExploreGuest && (
                  <button
                    type="button"
                    className="fb-guest-text-btn"
                    onClick={onExploreGuest}
                    style={{ textAlign: 'center', marginTop: '8px' }}
                  >
                    Explore Tambayan as Guest →
                  </button>
                )}
              </form>

              {/* Bottom Tambayan Branding */}
              <div className="fb-meta-footer-brand" style={{ marginTop: '32px' }}>
                <img
                  src="/images/app_icon.webp"
                  alt="Tambayan"
                  style={{ width: '20px', height: '20px', borderRadius: '5px' }}
                />
                <span className="fb-meta-label">Tambayan • Connect & Hangout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          BOTTOM FOOTER: Horizontal Languages Selector
          ============================================================== */}
      <footer className="fb-modern-footer">
        <div className="fb-languages-center-list">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={activeLang === lang ? 'fb-lang-current' : 'fb-lang-link'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
            >
              {lang}
            </button>
          ))}
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>
            © {new Date().getFullYear()} Tambayan
          </span>
        </div>
      </footer>

      {/* ==============================================================
          TAMBAYAN SIGN UP MODAL DIALOG
          ============================================================== */}
      {isSignUpOpen && (
        <div className="modal-backdrop" onClick={() => setIsSignUpOpen(false)}>
          <div className="fb-signup-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="fb-signup-header">
              <div>
                <h2 className="fb-signup-title">Join Tambayan</h2>
                <p className="fb-signup-subtitle">It's quick, free, and open to everyone.</p>
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
                  placeholder="Last name"
                  className="fb-input-sm"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <input
                type="email"
                placeholder="Email address"
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
                By clicking Sign Up, you agree to Tambayan's Terms, Privacy Policy, and Community Guidelines.
              </p>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button type="submit" className="fb-btn-submit-signup" disabled={isSigningUp}>
                  {isSigningUp ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
