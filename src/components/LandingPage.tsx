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
  Settings,
  Store,
  Bookmark,
  Clock,
  ArrowLeft,
  Sun,
  Moon,
} from 'lucide-react';
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
  // Current view mode: 'profile' (matches the screenshot with Mitchelle Salazar) or 'form' (credentials input)
  const [viewMode, setViewMode] = useState<'profile' | 'form'>('profile');

  // Saved user profile (Default matches user's screenshot: Mitchelle Salazar)
  const [savedUser, setSavedUser] = useState<SavedLogin>(() => {
    try {
      const stored = localStorage.getItem('tambayan_saved_logins');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch {
      // fallback
    }
    return {
      name: 'Mitchelle Salazar',
      email: 'mitchelle.salazar@student.tambayan.edu',
      avatar: '/images/avatar_leo.webp',
    };
  });

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Settings dropdown state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 70 }, (_, i) => String(2010 - i));

  // Handle Continue button click (Profile card)
  const handleContinue = async () => {
    if (savedUser.email && password) {
      setIsLoading(true);
      try {
        await signInWithEmailAndPassword(auth, savedUser.email, password);
        onLoginSuccess();
      } catch (err: any) {
        // If password is required or failed, switch to form view with email prefilled
        setEmail(savedUser.email);
        setViewMode('form');
        setLoginError('Please enter your password to continue.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setEmail(savedUser.email);
      setViewMode('form');
    }
  };

  // Handle Form Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Save recent login
      const newSaved: SavedLogin = {
        email: cred.user.email || email.trim(),
        name: cred.user.displayName || email.split('@')[0],
        avatar: cred.user.photoURL || '/images/avatar_leo.webp',
      };
      setSavedUser(newSaved);
      localStorage.setItem('tambayan_saved_logins', JSON.stringify([newSaved]));
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('The password you entered is incorrect. Please try again.');
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

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <div className="fb-modern-container">
      {/* Top Main Section: Split Left & Right Panes */}
      <div className="fb-modern-main">
        {/* ==============================================================
            LEFT PANE: Facebook Logo, Interactive Collage, & Bold Headline
            ============================================================== */}
        <div className="fb-modern-left-pane">
          {/* Facebook Circular Brand Mark Icon */}
          <div className="fb-brand-header">
            <svg
              viewBox="0 0 36 36"
              className="fb-round-logo-svg"
              width="44"
              height="44"
              fill="#0866FF"
              aria-label="Facebook Logo"
            >
              <path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.042 5.275 14.851 12.562 17.151V23.364H8.718V18h3.844v-4.086c0-3.793 2.26-5.889 5.717-5.889 1.656 0 3.388.295 3.388.295v3.725h-1.909c-1.88 0-2.467 1.167-2.467 2.366V18h4.198l-.671 5.364h-3.527v12.506c1.074.17 2.176.26 3.3.26.273 0 .543-.01.812-.03z" />
              <path
                fill="#ffffff"
                d="M24.718 23.364l.671-5.364h-4.198v-3.589c0-1.199.587-2.366 2.467-2.366h1.909V8.32s-1.732-.295-3.388-.295c-3.457 0-5.717 2.096-5.717 5.889V18H8.718v5.364h3.844v12.506a18.256 18.256 0 005.62 0V23.364h3.527z"
              />
            </svg>
          </div>

          {/* Dynamic 3D Collage Area (Exact Match to Screenshot) */}
          <div className="fb-collage-stage">
            {/* 1. Floating 😆 Haha Sticker */}
            <div className="fb-sticker fb-haha-sticker" title="Haha reaction">
              <span className="fb-emoji-char">😆</span>
            </div>

            {/* 2. Top-Left Marketplace Craft Knot Card */}
            <div className="fb-card-float fb-card-marketplace">
              <div className="fb-icon-badge fb-badge-market">
                <Store size={15} color="#fff" />
              </div>
              <img
                src="/images/landing_craft.webp"
                alt="Marketplace Knit Knot Pillow"
                className="fb-craft-photo"
              />
            </div>

            {/* 3. Center Story Video Skater Card */}
            <div className="fb-card-float fb-card-story-skater">
              {/* Purple Timestamp Badge */}
              <div className="fb-timestamp-badge">
                <Clock size={12} color="#fff" />
                <span>16:45</span>
              </div>

              {/* Skater Action Photo */}
              <img
                src="/images/landing_skater.webp"
                alt="Student Skater Story"
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

            {/* 4. Bottom-Left Cinema Event Ticket Card */}
            <div className="fb-card-float fb-card-cinema-ticket">
              <div className="fb-icon-badge fb-badge-event">
                <Bookmark size={15} color="#fff" />
              </div>
              <img
                src="/images/landing_ticket.webp"
                alt="Campus Cinema Tickets"
                className="fb-ticket-photo"
              />
              <div className="fb-ticket-skeleton">
                <div className="fb-skeleton-line fb-skel-w1" />
                <div className="fb-skeleton-line fb-skel-w2" />
              </div>
            </div>

            {/* 5. Bottom-Right Circular Avatar with Cyan Ring */}
            <div className="fb-avatar-ring-badge">
              <img
                src="/images/landing_avatar_round.webp"
                alt="Campus Student"
                className="fb-avatar-ring-img"
              />
            </div>
          </div>

          {/* Bold Headline (Exact Typography from Screenshot) */}
          <div className="fb-headline-wrapper">
            <h1 className="fb-headline-text">
              Explore<br />
              the things<br />
              <span className="fb-headline-blue">you love</span>.
            </h1>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div className="fb-vertical-divider" />

        {/* ==============================================================
            RIGHT PANE: User Profile Card / Login Form
            ============================================================== */}
        <div className="fb-modern-right-pane">
          {/* Top-Right Settings Gear */}
          <div className="fb-top-settings-anchor">
            <button
              className="fb-gear-btn"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              title="Settings"
            >
              <Settings size={22} />
            </button>

            {isSettingsOpen && (
              <div className="fb-settings-menu">
                <button className="fb-settings-item" onClick={toggleTheme}>
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button
                  className="fb-settings-item"
                  onClick={() => {
                    setViewMode(viewMode === 'profile' ? 'form' : 'profile');
                    setIsSettingsOpen(false);
                  }}
                >
                  <span>{viewMode === 'profile' ? 'Switch to Form View' : 'Switch to Profile View'}</span>
                </button>
              </div>
            )}
          </div>

          {/* VIEW MODE 1: Profile Action Card (Exact Match to Screenshot) */}
          {viewMode === 'profile' ? (
            <div className="fb-profile-action-box">
              {/* Circular Avatar */}
              <div className="fb-profile-avatar-circle">
                <img
                  src={savedUser.avatar}
                  alt={savedUser.name}
                  className="fb-profile-photo"
                />
              </div>

              {/* Profile Name */}
              <h2 className="fb-profile-fullname">{savedUser.name}</h2>

              {/* Action Buttons Stack */}
              <div className="fb-pill-buttons-stack">
                <button
                  type="button"
                  className="fb-pill-btn fb-pill-continue"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  {isLoading ? 'Connecting...' : 'Continue'}
                </button>

                <button
                  type="button"
                  className="fb-pill-btn fb-pill-secondary"
                  onClick={() => setViewMode('form')}
                >
                  Use another profile
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

              {/* Bottom Meta Branding */}
              <div className="fb-meta-footer-brand">
                <span className="fb-meta-symbol">♾</span>
                <span className="fb-meta-label">Meta</span>
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: Standard Credentials Login Card */
            <div className="fb-form-action-box">
              <button
                type="button"
                className="fb-back-profile-btn"
                onClick={() => setViewMode('profile')}
              >
                <ArrowLeft size={16} />
                <span>Back to profile</span>
              </button>

              <h2 className="fb-form-title">Log in to Tambayan</h2>

              {loginError && (
                <div className="fb-form-error-alert">
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="fb-modern-form">
                <input
                  type="text"
                  placeholder="Email or student phone number"
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

                <a
                  href="#forgot"
                  className="fb-forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link sent to registered campus email.');
                  }}
                >
                  Forgotten password?
                </a>

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
              </form>

              {/* Bottom Meta Branding */}
              <div className="fb-meta-footer-brand" style={{ marginTop: '32px' }}>
                <span className="fb-meta-symbol">♾</span>
                <span className="fb-meta-label">Meta</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==============================================================
          BOTTOM FOOTER: Horizontal Languages Selector (Exact Match)
          ============================================================== */}
      <footer className="fb-modern-footer">
        <div className="fb-languages-center-list">
          <span className="fb-lang-current">English (US)</span>
          <a href="#fil" className="fb-lang-link">Filipino</a>
          <a href="#ceb" className="fb-lang-link">Bisaya</a>
          <a href="#es" className="fb-lang-link">Español</a>
          <a href="#ja" className="fb-lang-link">日本語</a>
          <a href="#ko" className="fb-lang-link">한국어</a>
          <a href="#zh" className="fb-lang-link">中文(简体)</a>
          <a href="#more" className="fb-lang-link fb-more-langs">More languages...</a>
        </div>
      </footer>

      {/* ==============================================================
          FACEBOOK-STYLE SIGN UP MODAL DIALOG
          ============================================================== */}
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
    </div>
  );
};
