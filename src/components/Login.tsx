import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { login, signInWithGoogle } from '../firebaseAuth';

interface LoginProps {
  onForgotPassword?: () => void;
  onSignUp?: () => void;
}

const Login: React.FC<LoginProps> = ({ onForgotPassword, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await login(email, password);
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('An unknown error occurred. Please try again later.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        navigate('/dashboard');
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Log in</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="email-field">
          <label htmlFor="email" className="field-label">Email</label>
          <div className="input-container">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="password-field">
          <label htmlFor="password" className="field-label">Password</label>
          <div className="input-container">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
        </div>

        {/* ✅ Flex wrapper for alignment */}
        <div className="forgot-password-wrapper">
          <button
            type="button"
            className="forgot-password-btn"
            onClick={onForgotPassword}
          >
            Forgot Password
          </button>
        </div>

        <button type="submit" className="login-btn">
          Log in
        </button>
      </form>

      <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>

      <div className="signup-section">
        <span className="signup-text">Not registered yet?</span>
        <button
          type="button"
          className="signup-btn"
          onClick={onSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
