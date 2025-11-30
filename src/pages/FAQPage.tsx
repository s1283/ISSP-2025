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
  MdFastRewind,
  MdFastForward,
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
import AudioVisualizer from '../components/AudioVisualizer'; // Add this import
import './Dashboard.css';
import './FAQPage.css';

type FAQItem = { q: string; a: string };

// Utility function moved from Dashboard.tsx to be available
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

  // Destructure values directly from the context
  const {
    currentSong,
    isPlaying,
    playerTime, // Corrected from currentTime
    playerDuration, // Corrected from duration
    volume,
    playbackRate,
    isRepeat,
    isShuffle,
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
    if (currentSong) { // Use destructured currentSong
      setIsCurrentSongLiked(isSongLiked(currentSong.id));
    }
  }, [currentSong]); // Dependency changed to currentSong

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLike = () => {
    if (currentSong) { // Use destructured currentSong
      const newLikedStatus = toggleSongLike(currentSong.id);
      setIsCurrentSongLiked(newLikedStatus);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (currentSong) { // Use destructured currentSong
      const timelineEntry = {
        song: currentSong, // Use destructured currentSong
        emoji,
        timestamp: new Date().toISOString(),
        songTimestamp: playerTime, // Corrected from audioPlayer.currentTime
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
            <div className="nav-item" onClick={() => navigate('/dashboard/profile')}>
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

      {/* Music Player UI (uses currentSong from context) */}
      {currentSong && (
        <div className="music-player">
          <div className="player-left">
            <div className="player-album-art-container">
              <img
                src={currentSong.artwork} // Corrected from albumArt
                alt={currentSong.title}
                className="player-album-art"
              />
              <AudioVisualizer
                isPlaying={isPlaying}
              />
            </div>
            <div className="player-song-info">
              <div className="player-song-title">{currentSong.title || 'No Song Playing'}</div>
              <div className="player-song-artist">{currentSong.artist || 'Select a playlist'}</div>
            </div>
          </div>

          <div className="player-controls-inline">
            <button
              className="control-btn"
              onClick={playPrevious} // Use destructured playPrevious
              disabled={!currentSong} // Use destructured currentSong
            >
              <MdSkipPrevious size={20} />
            </button>
            <button
              className="control-btn"
              onClick={() => seekTo(Math.max(0, playerTime - 10))} // Use destructured seekTo and playerTime
              disabled={!currentSong} // Use destructured currentSong
            >
              <MdFastRewind size={20} />
            </button>
            <button
              className="control-btn play-main"
              onClick={togglePlay} // Use destructured togglePlay
              disabled={!currentSong} // Use destructured currentSong
            >
              {isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
            </button>
            <button
              className="control-btn"
              onClick={() => seekTo(Math.min(playerDuration, playerTime + 10))} // Use destructured seekTo, playerDuration, playerTime
              disabled={!currentSong} // Use destructured currentSong
            >
              <MdFastForward size={20} />
            </button>
            <button
              className="control-btn"
              onClick={playNext} // Use destructured playNext
              disabled={!currentSong} // Use destructured currentSong
            >
              <MdSkipNext size={20} />
            </button>
          </div>

          <div className="player-center">
            <div className="progress-bar">
              <span className="time-current">{formatTime(playerTime)}</span> {/* Use destructured playerTime */}
              <div
                className="progress-track"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  seekTo(percentage * playerDuration); // Use destructured seekTo and playerDuration
                }}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${playerDuration > 0 ? (playerTime / playerDuration) * 100 : 0}%` // Use destructured playerTime and playerDuration
                  }}
                ></div>
              </div>
              <span className="time-total">{formatTime(playerDuration)}</span> {/* Use destructured playerDuration */}
            </div>
          </div>

          <div className="player-right">
            <div className="volume-controls">
              <EmojiReaction onEmojiSelect={handleEmojiSelect} />
              <VolumeControl
                volume={volume} // Use destructured volume
                onVolumeChange={setVolume} // Use destructured setVolume
                onToggleMute={toggleMute} // Use destructured toggleMute
              />
              <PlaybackSpeedControl
                speed={playbackRate} // Use destructured playbackRate
                onChange={setPlaybackRate} // Use destructured setPlaybackRate
              />
              <button
                className={`volume-btn ${isRepeat ? 'liked' : ''}`} // Use destructured isRepeat
                onClick={toggleRepeat} // Use destructured toggleRepeat
              >
                <MdRepeat size={18} />
              </button>
              <button
                className={`volume-btn ${isShuffle ? 'liked' : ''}`} // Use destructured isShuffle
                onClick={toggleShuffle} // Use destructured toggleShuffle
              >
                <MdShuffle size={18} />
              </button>
              <button className={`volume-btn ${isCurrentSongLiked ? 'liked' : ''}`} onClick={toggleLike}>
                {isCurrentSongLiked ? <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />}
              </button>
              <button className="volume-btn"><MdMoreHoriz size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQPage;
