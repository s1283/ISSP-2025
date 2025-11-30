import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdTimeline,
  MdHelpOutline,
  MdLogout,
  MdPerson,
  MdPlayArrow, // Added for audio player
  MdPause,    // Added for audio player
  MdSkipNext,   // Added for audio player
  MdSkipPrevious, // Added for audio player
  MdFavorite,   // Added for audio player
  MdFavoriteBorder, // Added for audio player
  MdRepeat,     // Added for audio player
  MdShuffle,    // Added for audio player
  MdMoreHoriz,   // Added for audio player
  MdMenu, // Added for hamburger menu
} from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore'; // Added collection, addDoc, getDocs, updateDoc
import './ProfilePage.css';
import { useAudioPlayerContext } from '../context/AudioPlayerContext'; // Added for audio player
import AudioVisualizer from '../components/AudioVisualizer'; // Added for audio player
import VolumeControl from '../components/VolumeControl'; // Added for audio player
import PlaybackSpeedControl from '../components/PlaybackSpeedControl'; // Added for audio player
import EmojiReaction from '../components/EmojiReaction'; // Added for audio player
import { Song } from '../data/musicLibrary'; // Added for toggleLike function

const GENRES = [
  "Pop", "Rock", "Jazz", "Hip-Hop", "Classical", "Electronic", "Country", "Reggae", "R&B", "Metal",
  "Indie", "Alternative", "Blues", "Folk", "Punk", "Soul", "Funk", "Latin", "K-Pop", "EDM",
  "House", "Techno", "Trap", "Lo-fi", "Ambient", "Gospel", "World", "Ska", "Disco", "Grunge"
];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDOB, setEditingDOB] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [likedSongs, setLikedSongs] = useState<number[]>([]); // Added for audio player liked status
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
    currentPlaylist, // Needed for playNext/Previous disabled state
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
        setEmail(currentUser.email || '');
        await fetchUserData(currentUser.uid);
        // Fetch liked songs
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
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setPhoneNumber(data.phoneNumber || '');
        setDateOfBirth(data.dateOfBirth || '');
        setPreferences(data.preferences || []);
        setSelectedGenres(data.preferences || []);

        // If no preferences set, automatically show genre selection
        if (!data.preferences || data.preferences.length === 0) {
          setShowGenreModal(true);
        }
      } else {
        // New user - show genre selection
        setShowGenreModal(true);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleUpdateName = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { name }, { merge: true });
      setEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  const handleUpdateDOB = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { dateOfBirth }, { merge: true });
      setEditingDOB(false);
    } catch (err) {
      console.error('Failed to update DOB:', err);
    }
  };

  const handleUpdatePhone = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { phoneNumber }, { merge: true });
      setEditingPhone(false);
    } catch (err) {
      console.error('Failed to update phone:', err);
    }
  };

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSaveGenres = async () => {
    if (!user) return;
    try {
      // Save to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email,
        name: name,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        preferences: selectedGenres
      }, { merge: true });

      setPreferences(selectedGenres);
      setShowGenreModal(false);
      // Preferences saved silently
    } catch (err) {
      console.error('Failed to update genres:', err);
      alert('Failed to save preferences. Please try again.');
    }
  };

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

  // Helper to format time for display - copied from Dashboard
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  // Placeholder for handleEmojiSelect, if EmojiReaction is part of the player UI
  const handleEmojiSelect = (emoji: string) => {
    console.log(`Emoji selected on Profile Page: ${emoji}`);
    // In a real app, you'd likely save this mood to Firestore linked to the current song
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
      <div className="profile-page">
        <div className="main-content">Loading...</div>
      </div>
    );
  }

  const isCurrentSongLiked = currentSong && likedSongs.includes(currentSong.id);

  return (
    <div className="profile-page">
      <button className={`sidenav-toggle ${isSidenavOpen ? 'shifted' : ''}`}  onClick={() => setIsSidenavOpen(!isSidenavOpen)}>
                <MdMenu size={24} />
      </button>
      {/* Sidebar */}
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
            <div className="nav-item active">
              <span className="nav-icon"><MdPerson /></span>
              <span>Profile</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/timeline')} style={{ cursor: 'pointer' }}>
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

      {/* Main Content */}
      <main className="profile-content">
        <section className="profile-section">
          <h2 className="section-title">Account Information</h2>
          <div className="section-divider"></div>

          {/* Email */}
          <div className="info-row">
            <label className="info-label">Email</label>
            <div className="info-value-container">
              {editingEmail ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="info-input"
                />
              ) : (
                <>
                  <span className="info-value">{email}</span>
                  <span className="info-status unverified">Unverified</span>
                </>
              )}
              <button
                className="edit-btn"
                onClick={() => setEditingEmail(!editingEmail)}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="info-row">
            <label className="info-label">Password</label>
            <div className="info-value-container">
              <span className="info-value">************</span>
              <button
                className="edit-btn"
                onClick={() => setEditingPassword(!editingPassword)}
              >
                Edit
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="info-row">
            <label className="info-label">Name</label>
            <div className="info-value-container">
              {editingName ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="info-input"
                  />
                  <button className="save-btn" onClick={handleUpdateName}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">{name || 'Not set'}</span>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingName(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Date of Birth */}
          <div className="info-row">
            <label className="info-label">Date of Birth</label>
            <div className="info-value-container">
              {editingDOB ? (
                <>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="info-input"
                  />
                  <button className="save-btn" onClick={handleUpdateDOB}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">
                    {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not set'}
                  </span>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingDOB(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Phone Number */}
          <div className="info-row">
            <label className="info-label">Phone Number</label>
            <div className="info-value-container">
              {editingPhone ? (
                <>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="info-input"
                    placeholder="(123) 456-7890"
                  />
                  <button className="save-btn" onClick={handleUpdatePhone}>Save</button>
                </>
              ) : (
                <>
                  <span className="info-value">{phoneNumber || 'Not set'}</span>
                  <button
                    className="edit-btn"
                    onClick={() => setEditingPhone(true)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User ID */}
          <div className="info-row">
            <label className="info-label">User ID</label>
            <div className="info-value-container">
              <span className="info-value">{user?.uid || 'N/A'}</span>
            </div>
          </div>

          {/* Created At */}
          <div className="info-row">
            <label className="info-label">Member Since</label>
            <div className="info-value-container">
              <span className="info-value">
                {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>

          {/* Last Sign In */}
          <div className="info-row">
            <label className="info-label">Last Sign In</label>
            <div className="info-value-container">
              <span className="info-value">
                {user?.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        {/* Music Preferences */}
        <section className="profile-section">
          <div className="section-header-with-edit">
            <h2 className="section-title">Music Preferences</h2>
            <button
              className="edit-btn"
              onClick={() => setShowGenreModal(!showGenreModal)}
            >
              {showGenreModal ? 'Cancel' : (preferences.length > 0 ? 'Edit' : 'Add')}
            </button>
          </div>
          <div className="section-divider"></div>

          {!showGenreModal ? (
            preferences.length > 0 ? (
              <div className="music-tiles">
                {preferences.map((genre, index) => (
                  <div
                    key={index}
                    className={`music-tile ${index % 2 === 0 ? 'purple' : 'orange'}`}
                  >
                    {genre}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1rem', background: '#F0F0F0', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ margin: 0 }}>
                  You have no saved music preferences. Edit them to get better recommendations.
                </p>
              </div>
            )
          ) : (
            <div className="genre-selection-inline">
              <p className="genre-instruction">Select Your Favorite Genres</p>
              <div className="genre-grid">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`genre-btn ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  onClick={handleSaveGenres}
                  className="save-btn"
                  style={{ padding: '12px 24px' }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </section>
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
                onClick={() => currentSong && toggleLike(currentSong)}
                title="Like song"
              >
                {isCurrentSongLiked ?
                  <MdFavorite size={18} /> : <MdFavoriteBorder size={18} />
                }
              </button>
              <button
                className="volume-btn"
                onClick={() => {}}
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

export default ProfilePage;
