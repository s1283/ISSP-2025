import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdPerson,
  MdTimeline,
  MdHelpOutline,
  MdLogout,
  MdSkipPrevious,
  MdSkipNext,
  MdPlayArrow,
  MdPause,
  MdShuffle,
  MdFavoriteBorder,
  MdFavorite,
  MdMoreHoriz,
  MdRepeat,
  MdMenu,
} from 'react-icons/md';
import { usePageTitle } from './hooks/usePageTitle';
import { logout } from '../firebaseAuth';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';
import { isSongLiked, toggleSongLike } from '../data/musicLibrary';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import AudioVisualizer from '../components/AudioVisualizer';
import './Dashboard.css';
import './FAQPage.css';

type FAQItem = { q: string; a: string };

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const FAQPage: React.FC = () => {
  usePageTitle('FAQs');
  const navigate = useNavigate();
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);

  const {
    currentSong,
    isPlaying,
    playerTime,
    playerDuration,
    volume,
    playbackRate,
    isRepeat,
    isShuffle,
    currentPlaylist,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleShuffle,
    toggleRepeat,
  } = useAudioPlayerContext();

  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);

  useEffect(() => {
    if (currentSong) {
      setIsCurrentSongLiked(isSongLiked(currentSong.id));
    }
  }, [currentSong]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLike = () => {
    if (currentSong) {
      const newLikedStatus = toggleSongLike(currentSong.id);
      setIsCurrentSongLiked(newLikedStatus);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (currentSong) {
      const timelineEntry = {
        song: currentSong,
        emoji,
        timestamp: new Date().toISOString(),
        songTimestamp: playerTime,
      };
      const existingTimeline = JSON.parse(localStorage.getItem('timeline') || '[]');
      localStorage.setItem('timeline', JSON.stringify([...existingTimeline, timelineEntry]));
    }
  };

  const faqs: { category: string; items: FAQItem[] }[] = [
    {
      category: 'Getting Started',
      items: [
        { q: 'How do I create an account?', a: 'You can sign up using email/password or Google sign-in from the signup page.' },
        { q: 'How do I reset my password?', a: 'Use the "Forgot password" link on the login page to request a reset email.' },
      ],
    },
    {
      category: 'Music & Playlists',
      items: [
        { q: 'How do I add songs to a playlist?', a: 'Open a playlist and click the "Add" button next to any song.' },
        { q: 'What is the "Liked" playlist?', a: 'The "Liked" playlist contains all songs you tap the heart button for.' },
      ],
    },
    {
      category: 'Account & Settings',
      items: [
        { q: 'How do I change my email address?', a: 'Go to Profile → Account Information and use the Edit button to request a change.' },
        { q: 'How do I delete my account?', a: 'Contact support through the Contact page; we will guide you through verification and deletion.' },
      ],
    },
  ];

  const toggleKey = (key: string) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidenavOpen(false);
      } else {
        setIsSidenavOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard">
      <button className={`sidenav-toggle ${isSidenavOpen ? 'shifted' : ''}`}  onClick={() => setIsSidenavOpen(!isSidenavOpen)}>
                <MdMenu size={24} />
      </button>
      <aside className={`sidenav ${isSidenavOpen ? 'open' : ''}`}>
        <div className="sidenav-header">
          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img
              src="/assets/images/braintest-logo.png"
              alt="BrainTest Music"
              className="logo-icon"
            />
          </div>
        </div>
        <div className="nav-section">
          <h3 className="nav-section-title">Menu</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => navigate('/dashboard')}>
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/profile')}>
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/timeline')}>
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
          </nav>
        </div>
        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item active">
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>FAQs</h2>
        </header>
        <section className="faq-container">
          {faqs.map(cat => (
            <div className="faq-category" key={cat.category}>
              <h3 className="faq-category-title">{cat.category}</h3>
              <div className="faq-list">
                {cat.items.map((item, idx) => {
                  const key = `${cat.category}-${idx}`;
                  const open = openSet.has(key);
                  return (
                    <div className="faq-card" key={key}>
                      <button
                        className={`faq-question ${open ? 'open' : ''}`}
                        aria-expanded={open}
                        onClick={() => toggleKey(key)}
                      >
                        <span>{item.q}</span>
                        <span className="faq-chevron">{open ? '+' : '−'}</span>
                      </button>
                      <div className={`faq-answer ${open ? 'open' : ''}`}>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>

      {currentSong && (
        <div className="music-player">
          <div className="player-left">
            <div className="player-album-art-container">
              <img 
                src={currentSong.artwork} 
                alt={currentSong.title} 
                className="player-album-art"
              />
              <AudioVisualizer 
                isPlaying={isPlaying} 
              />
            </div>
            <div className="player-song-info">
              <div className="player-song-title">{currentSong.title}</div>
              <div className="player-song-artist">{currentSong.artist}</div>
            </div>
          </div>

          <div className="player-controls-inline">
            <button 
              className="control-btn" 
              onClick={playPrevious}
              disabled={currentPlaylist.length === 0}
            >
              <MdSkipPrevious size={20} />
            </button>
            <button 
              className="control-btn control-btn-play" 
              onClick={togglePlay}
            >
              {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
            </button>
            <button 
              className="control-btn" 
              onClick={playNext}
              disabled={currentPlaylist.length === 0}
            >
              <MdSkipNext size={20} />
            </button>
          </div>

          <div className="player-center">
            <div className="progress-bar">
              <span className="time-current">{formatTime(playerTime)}</span>
              <div 
                className="progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  seekTo(percentage * playerDuration);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${playerDuration > 0 ? (playerTime / playerDuration) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <span className="time-total">{formatTime(playerDuration)}</span>
            </div>
          </div>

          <div className="player-right">
            <div className="volume-controls">
              <EmojiReaction onEmojiSelect={handleEmojiSelect} />
              <VolumeControl
                volume={volume}
                onVolumeChange={setVolume}
                onToggleMute={toggleMute}
              />
              <PlaybackSpeedControl
                speed={playbackRate}
                onChange={setPlaybackRate}
              />
              <button 
                className={`volume-btn ${isRepeat ? 'liked' : ''}`}
                onClick={toggleRepeat}
              >
                <MdRepeat size={18} />
              </button>
              <button 
                className={`volume-btn ${isShuffle ? 'liked' : ''}`}
                onClick={toggleShuffle}
              >
                <MdShuffle size={18} />
              </button>
              <button 
                className={`volume-btn ${isCurrentSongLiked ? 'liked' : ''}`} 
                onClick={toggleLike}
                title="Like song"
              >
                {isCurrentSongLiked ? 
                  <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />
                }
              </button>
              <button 
                className="volume-btn" 
                title="Add to playlist"
              >
                <MdMoreHoriz size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
