import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdDashboard,
  MdTimeline,
  MdPerson,
  MdHelpOutline,
  MdLogout,
  MdPlayArrow,
  MdPause,
  MdArrowBack,
  MdSkipNext,
  MdSkipPrevious,
  MdFavorite,
  MdFavoriteBorder,
  MdMoreHoriz,
  MdRepeat,
  MdShuffle,
  MdMenu
} from 'react-icons/md';
import { auth, db } from '../firebaseConfig';
import { User, signOut } from 'firebase/auth';
import { collection, getDocs, doc, addDoc, updateDoc } from 'firebase/firestore';
import AudioVisualizer from '../components/AudioVisualizer';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import './PlaylistDetail.css';
import { Song } from '../data/musicLibrary';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

const fetchSongsByGenre = async (genre: string): Promise<Song[]> => {
  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(genre + " music")}&media=music&entity=song&limit=50`
    );
    const data = await response.json();

    if (!data.results) return [];

    return data.results
      .filter((track: any) => track.previewUrl)
      .slice(0, 20)
      .map((track: any): Song => ({
        id: track.trackId,
        title: track.trackName,
        artist: track.artistName,
        artwork: track.artworkUrl100.replace("100x100", "300x300"),
        genre: track.primaryGenreName,
        previewUrl: track.previewUrl,
      }));
  } catch (err) {
    console.error("iTunes API error:", err);
    return [];
  }
};

const PlaylistDetail: React.FC = () => {
  const navigate = useNavigate();
  const { playlistName } = useParams<{ playlistName: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [isSidenavOpen, setIsSidenavOpen] = useState(false);

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
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleShuffle,
    toggleRepeat,
    setPlaylist: setAudioPlayerPlaylist,
  } = useAudioPlayerContext();

  const fetchPlaylist = useCallback(async (name: string, currentUser: User) => {
    setLoading(true);
    try {
      const decodedName = decodeURIComponent(name);
      let fetchedPlaylist: Playlist | null = null;

      if (decodedName === "Liked Songs") {
        const likedSongsRef = collection(db, 'users', currentUser.uid, 'likedSongs');
        const likedDocs = await getDocs(likedSongsRef);
        const likedSongsData = likedDocs.docs
          .filter(doc => !doc.data().deleted)
          .map(doc => {
            const data = doc.data();
            return {
              id: data.id,
              title: data.title,
              artist: data.artist,
              artwork: data.artwork,
              genre: data.genre,
              previewUrl: data.previewUrl
            } as Song;
          })
          .sort((a, b) => {
            const aData = likedDocs.docs.find(d => d.data().id === a.id)?.data();
            const bData = likedDocs.docs.find(d => d.data().id === b.id)?.data();
            const aTime = aData?.likedAt ? new Date(aData.likedAt).getTime() : 0;
            const bTime = bData?.likedAt ? new Date(bData.likedAt).getTime() : 0;
            return bTime - aTime;
          });

        fetchedPlaylist = {
          id: 'liked-songs',
          name: 'Liked Songs',
          songs: likedSongsData
        };
      } else {
        const songs = await fetchSongsByGenre(decodedName);
        fetchedPlaylist = {
          id: decodedName,
          name: decodedName,
          songs: songs
        };
      }

      setPlaylist(fetchedPlaylist);
      if (fetchedPlaylist && fetchedPlaylist.songs.length > 0) {
        setAudioPlayerPlaylist(fetchedPlaylist.songs);
      }
    } catch (err) {
      console.error("Failed to fetch playlist:", err);
    } finally {
      setLoading(false);
    }
  }, [setAudioPlayerPlaylist]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser && playlistName) {
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

        fetchPlaylist(playlistName, currentUser);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [playlistName, fetchPlaylist]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlaySong = (song: Song, songsList: Song[]) => {
    setAudioPlayerPlaylist(songsList);
    playSong(song, songsList);
  };

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
        seconds: now.getMinutes(),
      });
    } catch (err) {
      console.error("Failed to save emoji reaction:", err);
    }
  };

  const toggleLike = async (song: Song) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const likedSongsRef = collection(userRef, 'likedSongs');

      if (likedSongs.includes(song.id)) {
        setLikedSongs(likedSongs.filter(id => id !== song.id));
        const likedDocs = await getDocs(likedSongsRef);
        const songDoc = likedDocs.docs.find(doc => doc.data().id === song.id);
        if (songDoc) {
          await updateDoc(doc(db, 'users', user.uid, 'likedSongs', songDoc.id), {
            deleted: true
          });
        }
        if (playlist?.id === 'liked-songs') {
          setPlaylist({
            ...playlist,
            songs: playlist.songs.filter(s => s.id !== song.id)
          });
        }
      } else {
        setLikedSongs([...likedSongs, song.id]);
        await addDoc(likedSongsRef, {
          id: song.id,
          title: song.title,
          artist: song.artist,
          artwork: song.artwork,
          genre: song.genre,
          previewUrl: song.previewUrl,
          likedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="playlist-detail">
        <div className="main-content">Loading playlist...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="playlist-detail">
        <div className="main-content">
          <p>Playlist not found</p>
          <button className="btn-login" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const isCurrentSongLiked = currentSong && likedSongs.includes(currentSong.id);

  return (
    <div className="playlist-detail">
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

        <div className="version-info">version 5.5.1</div>
      </aside>

      <main className="playlist-content">
        <button className={`sidenav-toggle ${isSidenavOpen ? 'shifted' : ''}`} onClick={() => setIsSidenavOpen(!isSidenavOpen)}>
                  <MdMenu size={24} />
        </button>
        
        <div className="playlist-header">
          <button
            className="btn-login"
            onClick={() => navigate('/dashboard')}
            style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <MdArrowBack /> Back
          </button>
          <h1 className="playlist-title">{playlist.name}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>

        <div className="songs-section">
          {playlist.songs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
              No songs in this playlist yet.
            </div>
          ) : (
            <div className="playlists-grid">
              {playlist.songs.map((song) => (
                <div
                  key={song.id}
                  className="playlist-card song-card"
                >
                  <div className="song-card-image-wrapper" onClick={() => handlePlaySong(song, playlist.songs)}>
                    <img
                      src={song.artwork}
                      alt={song.title}
                      className="song-card-image"
                    />
                    <div className="song-card-play-overlay">
                      {currentSong?.id === song.id && isPlaying ? (
                        <MdPause color="#fff" size={32} />
                      ) : (
                        <MdPlayArrow color="#fff" size={32} />
                      )}
                    </div>
                  </div>
                  <div className="song-card-info">
                    <h4 className="song-card-title">{song.title}</h4>
                    <p className="song-card-artist">{song.artist}</p>
                    <p className="song-card-genre">{song.genre}</p>
                    <button
                      className="song-like-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song);
                      }}
                    >
                      {likedSongs.includes(song.id) ?
                        <MdFavorite size={20} color="#ED6F3A" /> :
                        <MdFavoriteBorder size={20} color="#666" />
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
                onClick={() => currentSong && toggleLike(currentSong)}
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

export default PlaylistDetail;
