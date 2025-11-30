import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../firebaseAuth';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    agreedToTerms: false,
    selectedGenres: [] as string[],
  });
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const musicGenres = [
    'Classical', 'Jazz', 'Rock', 'Pop', 'Country', 'Folk',
    'Blues', 'Gospel', 'Reggae', 'R&B/Soul',
    'Instrumental', 'Nature Sounds', 'Relaxation Music'
  ];

  const handleNext = () => {
    if (step === 2 && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setStep(step + 1)
  };
  const handleBack = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genre)
        ? prev.selectedGenres.filter(g => g !== genre)
        : [...prev.selectedGenres, genre]
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 5) {
        handleNext();
      }
    }
  };

  const finishSignUp = async (genres: string[]) => {
    setError(null);
    setLoading(true);

    if (!formData.email.includes('@')) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!formData.agreedToTerms) {
      setError("You must agree to the Terms and Conditions.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signUp(formData.email, formData.password);
      if (userCredential && userCredential.user) {
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);

        let birthDate = '';
        if (formData.birthYear && formData.birthMonth && formData.birthDay) {
          birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
        }

        await setDoc(userRef, {
            email: user.email,
            preferences: genres,
            dateOfBirth: birthDate,
        }, { merge: true });

        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError(
          <span>
            This email address is already in use. Please <a href="/login">log in</a>.
          </span>
        );
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      } else {
        setError('An unknown error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await finishSignUp(formData.selectedGenres);
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch {
      setError('Failed to sign in with Google. Please try again later.');
    }
  };
  
  const handleSkip = async () => {
    await finishSignUp([]);
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-field">
            <label htmlFor="email" className="field-label">Email</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <>
            <div className="form-field">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
              <div className="input-container">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <div className="form-field">
            <label className="field-label">Birthdate</label>
            <div className="birthdate-container">
              <select name="birthMonth" value={formData.birthMonth} onChange={handleChange} className="birthdate-select">
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select name="birthDay" value={formData.birthDay} onChange={handleChange} className="birthdate-select">
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}</select>
              <select name="birthYear" value={formData.birthYear} onChange={handleChange} className="birthdate-select">
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-field">
            <div className="terms-container">
              <input
                type="checkbox"
                name="agreedToTerms"
                id="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreedToTerms" className="terms-label">
                I agree to the <a href="https://braintest.com/terms/">Terms and Conditions</a>.
              </label>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="form-field">
            <label className="field-label">What music genres do you enjoy?</label>
            <p className="field-subtitle">Select all that apply (you can skip this step)</p>
            <div className="genre-grid">
              {musicGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`genre-chip ${formData.selectedGenres.includes(genre) ? 'selected' : ''}`}
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="selected-count">
              {formData.selectedGenres.length > 0 && (
                <p className="selection-info">
                  {formData.selectedGenres.length} genre{formData.selectedGenres.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="signup-wrapper">
      <div className="signup-inner">
        <section className="signup-container">
          <h1 className="signup-title">Sign up</h1>
          {error && <div className="error-message">{error}</div>}
          <form className="signup-form">
            <div className="form-step">{renderStep()}</div>
            <div className="navigation-buttons">
              {step > 1 && <button type="button" onClick={handleBack} className="back-btn">Back</button>}
              {step < 5 && <button type="button" onClick={handleNext} className="next-btn">Next</button>}
              {step === 5 && (
                <div className="final-step-buttons">
                  <button type="button" onClick={handleSkip} className="skip-btn" disabled={loading}>
                    Skip for now
                  </button>
                  <button type="button" onClick={handleSubmit} className="signup-btn" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign up'}
                  </button>
                </div>
              )}
            </div>
          </form>
          {step < 5 && (
            <div className="signup-footer">
              <button type="button" className="google-btn" onClick={handleGoogleSignIn} disabled={loading}>
                Sign up with Google
              </button>
              <div className="login-section">
                <p className="login-text">Already have an account?</p>
                <a href="/login" className="login-btn-link">Log in</a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Signup;
