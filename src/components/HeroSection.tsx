import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const HeroSection: React.FC = () => {
  const [musicWaveError, setMusicWaveError] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleImageLoad = () => {
    console.log('Hero image loaded');
  };

  const handleMusicWaveError = () => {
    setMusicWaveError(true);
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <section className="hero-section">
      <Container>
        <h1 className="hero-title">
          CREATE<br/>YOUR<br/>LIFE'S<br/>PLAYLISTS
        </h1>
        {!user && (
            <button 
                className="hero-signup-btn" 
                onClick={handleSignupClick}
                style={{border: 'none', cursor: 'pointer'}}
            >
                Sign up
            </button>
        )}
        
        <div className="music-wave-container">
          {!musicWaveError ? (
            <img 
              src="/assets/images/music_notes 1.png" 
              alt="Music Notes" 
              className="music-wave-img"
              onLoad={handleImageLoad}
              onError={handleMusicWaveError}
            />
          ) : (
            <div className="music-wave-fallback" style={{display: 'block'}}></div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
