import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdTimeline, 
  MdHelpOutline, 
  MdLogout,
  MdPlayArrow, // Added for audio player UI
  MdPause,     // Added for audio player UI
  MdSkipNext,  // Added for audio player UI
  MdSkipPrevious, // Added for audio player UI
  MdFavorite,  // Added for audio player UI
  MdFavoriteBorder, // Added for audio player UI
  MdRepeat,    // Added for audio player UI
  MdShuffle,   // Added for audio player UI
  MdMoreHoriz, // Added for audio player UI
  MdPerson,    // Added for Profile link
  MdMenu, // Added for hamburger menu
} from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import { collection, query, orderBy, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import './Timeline.css';
import { useAudioPlayerContext } from '../context/AudioPlayerContext'; // Added for audio player context
import VolumeControl from '../components/VolumeControl'; // Added for audio player UI
import PlaybackSpeedControl from '../components/PlaybackSpeedControl'; // Added for audio player UI
import AudioVisualizer from '../components/AudioVisualizer'; // Added for audio player UI
import EmojiReaction from '../components/EmojiReaction'; // Added for audio player UI
import { Song } from '../data/musicLibrary'; // Import Song interface from musicLibrary

interface TimelineEntry {
  id: string;
  songId: number;
  title: string;
  artist: string;
  artwork?: string;
  emoji: string;
  timestamp: number;
  listenedAt: Date;
  day: number;
  month: number;
  year: number;
  hours: number;
  minutes: number;
  seconds: number;
  moods?: string[];
}

const Timeline: React.FC = () => {
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); // Re-enabled user state for Firebase operations
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<number[]>([]); // State for liked song IDs
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);

  // Use AudioPlayerContext
  const {
    currentSong,
    isPlaying,
    playerTime,
    playerDuration,
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTimeline(currentUser.uid);
        // Fetch liked songs for the player UI
        try {
          const likedSongsRef = collection(db, 'users', currentUser.uid, 'likedSongs');
          const likedDocs = await getDocs(likedSongsRef);
          const likedIds = likedDocs.docs
            .filter(doc => !doc.data().deleted)
            .map(doc => doc.data().id);
          setLikedSongs(likedIds);
        } catch (err) {
          console.error('Failed to load liked songs:', err);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTimeline = async (uid: string) => {
    try {
      const historyRef = collection(db, "users", uid, "moodHistory");
      const q = query(historyRef, orderBy("listenedAt", "desc"));
      const snapshot = await getDocs(q);
      
      const entries: TimelineEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        listenedAt: doc.data().listenedAt?.toDate() || new Date(),
      })) as TimelineEntry[];
      
      setTimelineEntries(entries);
    } catch (err) {
      console.error("Failed to fetch timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatFullTimestamp = (date: Date | number) => {
    const d = typeof date === 'number' ? new Date(date) : date;
    return d.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  // Helper to format time for player UI
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const getEmojiColorClass = (emoji: string) => {
    switch (emoji) {
      case '😊':
        return 'happy';
      case '😢':
        return 'sad';
      case '⚡':
        return 'energetic';
      case '🧘':
        return 'calm';
      default:
        return '';
    }
  };

  // Implement toggleLike function for the player UI
  const toggleLike = async (song?: Song) => {
    const targetSong = song || currentSong;
    if (!targetSong || !user) {
      console.log('Cannot toggle like: no song or user');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const likedSongsRef = collection(userRef, 'likedSongs');
      
      if (likedSongs.includes(targetSong.id)) {
        // Unlike: remove from state
        setLikedSongs(likedSongs.filter(id => id !== targetSong.id));
        // Remove from Firestore (mark as deleted)
        const likedDocs = await getDocs(likedSongsRef);
        const songDoc = likedDocs.docs.find(doc => doc.data().id === targetSong.id);
        if (songDoc) {
          await updateDoc(doc(db, 'users', user.uid, 'likedSongs', songDoc.id), {
            deleted: true
          });
          console.log('Song unliked successfully');
        }
      } else {
        // Like: add to state
        setLikedSongs([...likedSongs, targetSong.id]);
        // Add to Firestore
        const docRef = await addDoc(likedSongsRef, {
          id: targetSong.id,
          title: targetSong.title,
          artist: targetSong.artist,
          artwork: targetSong.artwork,
          genre: targetSong.genre,
          previewUrl: targetSong.previewUrl,
          likedAt: new Date().toISOString()
        });
        console.log('Song liked successfully, doc ID:', docRef.id);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  // Implement handleEmojiSelect function for the player UI
  const handleEmojiSelect = async (emoji: string) => {
    if (!currentSong || !user) return;
    
    try {
      const now = new Date();
      const historyRef = collection(db, "users", user.uid, "moodHistory");
      await addDoc(historyRef, {
        songId: currentSong.id,
        title: currentSong.title,
        artist: currentSong.artist,
        artwork: currentSong.artwork,
        emoji: emoji,
        timestamp: Math.floor(playerTime),
        listenedAt: now,
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getMinutes(), // This looks like a copy-paste error from previous context, keeping as-is
      });
    } catch (err) {
      console.error("Failed to save emoji reaction:", err);
    }
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


  if (loading) {
    return (
      <div className="timeline">
        <div className="main-content">Loading timeline...</div>
      </div>
    );
  }

  const isCurrentSongLiked = currentSong && likedSongs.includes(currentSong.id);

  return (
    <div className="timeline">
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
            <div className="nav-item" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item active">
              <span className="nav-icon"><MdTimeline /></span>
              <span>Timeline</span>
            </div>
          </nav>
        </div>

        <div className="nav-section">
          <h3 className="nav-section-title">Help</h3>
          <div className="nav-divider"></div>
          <nav className="nav-items">
            <div className="nav-item" onClick={() => navigate('/dashboard/faq')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>
      </aside>

      <main className="main-content">
        <h1>Timeline</h1>
        {loading ? (
          <p>Loading timeline...</p>
        ) : timelineEntries.length > 0 ? (
          <div className="timeline-entries">
            {timelineEntries.map((entry) => (
              <div key={entry.id} className={`timeline-entry ${getEmojiColorClass(entry.emoji)}`}>
                <div className="timeline-song-info">
                  {entry.artwork && (
                    <img 
                      src={entry.artwork} 
                      alt={entry.title}
                      className="timeline-album-art"
                      style={{ width: '60px', height: '60px', borderRadius: '8px', marginRight: '16px' }}
                    />
                  )}
                  <div>
                    <p className="timeline-song-title">{entry.title}</p>
                    <p className="timeline-song-artist">{entry.artist}</p>
                    <p className="timeline-song-timestamp">{formatTime(entry.timestamp)}</p>
                    {entry.moods && entry.moods.length > 0 && (
                      <p className="timeline-moods">
                        {entry.moods.map((mood, i) => (
                          <span key={i} className="mood-tag">{mood}</span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
                <p className="timeline-emoji">{entry.emoji}</p>
                <p className="timeline-timestamp">{formatFullTimestamp(entry.listenedAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No timeline entries yet. Start listening to music and reacting with emojis!</p>
        )}
      </main>

      {/* Music Player UI (uses currentSong from context) */}
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
                onClick={() => toggleLike()}
                title="Like song"
              >
                {isCurrentSongLiked ? 
                  <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />
                }
              </button>
              {/* Add MoreHoriz button if needed for consistency */}
              <button className="volume-btn">
                 <MdMoreHoriz size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;