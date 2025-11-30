export {};
/*
// Dashboard with iTunes Integration
import React, { useState, useEffect } from 'react'; // Removed useRef
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdPerson, 
  MdTimeline, 
  MdSettings, 
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
  MdRepeat
} from 'react-icons/md';
import PlaylistCard from '../components/PlaylistCard';
import GenreSelectionModal from '../components/GenreSelectionModal';
import VolumeControl from '../components/VolumeControl';
import PlaybackSpeedControl from '../components/PlaybackSpeedControl';
import EmojiReaction from '../components/EmojiReaction';
import { logout } from '../firebaseAuth';
import { useAudioPlayerContext } from '../context/AudioPlayerContext';
import { getSongsForGenre, getLikedSongs, isSongLiked, toggleSongLike, formatTime } from '../data/musicLibrary';
import './Dashboard.css';

interface Playlist {
  name: string;
  genres: string[];
}

const Dashboard: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const storedPlaylists = localStorage.getItem('playlists');
    return storedPlaylists ? JSON.parse(storedPlaylists) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const audioPlayer = useAudioPlayerContext();
  
  const [isCurrentSongLiked, setIsCurrentSongLiked] = useState(false);

  useEffect(() => {
    if (audioPlayer.currentSong) {
      setIsCurrentSongLiked(isSongLiked(audioPlayer.currentSong.id));
    }
  }, [audioPlayer.currentSong]);

  const toggleLike = () => {
    if (audioPlayer.currentSong) {
      const newLikedStatus = toggleSongLike(audioPlayer.currentSong.id);
      setIsCurrentSongLiked(newLikedStatus);
    }
  };

  useEffect(() => {
    if (location.state && location.state.selectedGenres && location.state.selectedGenres.length > 0) {
      updatePlaylists(location.state.selectedGenres);
    }
  }, [location.state]);

  const updatePlaylists = (selectedGenres: string[]) => {
    const newPlaylists = selectedGenres.map((genre: string) => ({
      name: genre,
      genres: [genre],
    }));
    setPlaylists(newPlaylists);
    localStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const handleSaveGenres = (selectedGenres: string[]) => {
    updatePlaylists(selectedGenres);
    setIsModalOpen(false);
  };

  const isPlaylistCurrent = (playlistName: string) => {
    return audioPlayer.currentPlaylistSource === playlistName;
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    let songs;
    if (playlist.name === 'Liked') {
      songs = getLikedSongs();
    } else {
      songs = getSongsForGenre(playlist.name);
    }
    
    if (songs.length > 0) {
      audioPlayer.setPlaylist(songs, playlist.name);
      audioPlayer.playSong(songs[0]);
    } else {
      alert(playlist.name === 'Liked' ? 'No liked songs yet. Like some songs to play them!' : 'No songs available for this playlist.');
    }
  };

  const handleDeletePlaylist = (playlistName: string) => {
    if (playlistName === 'Liked') {
      alert('Cannot delete the Liked playlist');
      return;
    }
    const updatedPlaylists = playlists.filter(p => p.name !== playlistName);
    setPlaylists(updatedPlaylists);
    localStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
  };

  const handleEmojiSelect = (emoji: string) => {
    if (audioPlayer.currentSong) {
      const timelineEntry = {
        song: audioPlayer.currentSong,
        emoji,
        timestamp: new Date().toISOString(),
        songTimestamp: audioPlayer.currentTime,
      };
      const existingTimeline = JSON.parse(localStorage.getItem('timeline') || '[]');
      localStorage.setItem('timeline', JSON.stringify([...existingTimeline, timelineEntry]));
    }
  };

  return (
    <div className="dashboard">
      <aside className="sidenav">
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
            <div className="nav-item active">
              <span className="nav-icon"><MdDashboard /></span>
              <span>Dashboard</span>
            </div>
            <div className="nav-item" onClick={() => alert('Profile page coming soon!')} style={{ cursor: 'pointer' }}>
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
            <div className="nav-item" onClick={() => alert('Settings page coming soon!')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdSettings /></span>
              <span>Settings</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/dashboard/faq')} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdHelpOutline /></span>
              <span>FAQs</span>
            </div>
            <div className="nav-item" onClick={async () => {
              await logout();
              navigate('/');
            }} style={{ cursor: 'pointer' }}>
              <span className="nav-icon"><MdLogout /></span>
              <span>Log out</span>
            </div>
          </nav>
        </div>

        <button className="change-genre-btn" onClick={() => setIsModalOpen(true)}>
          Change Genre
        </button>

        <div className="version-info">
          <span>version 5.5.1</span>
        </div>
      </aside>

      <main className="main-content">
        <div className="playlists-grid">
          <PlaylistCard 
            key="liked" 
            playlist={{ name: "Liked", genres: ["Favorites"] }} 
            isLiked={true}
            onPlay={handlePlayPlaylist}
            onDelete={handleDeletePlaylist}
            isPlaying={audioPlayer.isPlaying}
            isCurrentPlaylist={isPlaylistCurrent("Liked")}
            onTogglePlay={audioPlayer.togglePlay}
          />
          {playlists.map((playlist, index) => (
            <PlaylistCard 
              key={index} 
              playlist={playlist}
              onPlay={handlePlayPlaylist}
              onDelete={handleDeletePlaylist}
              isPlaying={audioPlayer.isPlaying}
              isCurrentPlaylist={isPlaylistCurrent(playlist.name)}
              onTogglePlay={audioPlayer.togglePlay}
            />
          ))}
        </div>
      </main>

      <div className="music-player">
        <div className="player-left">
          <div 
            className="album-art" 
            style={{ 
              backgroundImage: audioPlayer.currentSong?.albumArt ? `url(${audioPlayer.currentSong.albumArt})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          <div className="song-info">
            <div className="song-title">{audioPlayer.currentSong?.title || 'No Song Playing'}</div>
            <div className="song-artist">{audioPlayer.currentSong?.artist || 'Select a playlist'}</div>
          </div>
        </div>

        <div className="player-controls-inline">
          <button 
            className="control-btn" 
            onClick={audioPlayer.playPrevious}
            disabled={!audioPlayer.currentSong}
          >
            <MdSkipPrevious size={20} />
          </button>
          <button 
            className="control-btn" 
            onClick={() => audioPlayer.seekTo(Math.max(0, audioPlayer.currentTime - 10))}
            disabled={!audioPlayer.currentSong}
          >
            <MdFastRewind size={20} />
          </button>
          <button 
            className="control-btn play-main" 
            onClick={audioPlayer.togglePlay}
            disabled={!audioPlayer.currentSong}
          >
            {audioPlayer.isPlaying ? <MdPause size={18} /> : <MdPlayArrow size={18} />}
          </button>
          <button 
            className="control-btn"
            onClick={() => audioPlayer.seekTo(Math.min(audioPlayer.duration, audioPlayer.currentTime + 10))}
            disabled={!audioPlayer.currentSong}
          >
            <MdFastForward size={20} />
          </button>
          <button 
            className="control-btn" 
            onClick={audioPlayer.playNext}
            disabled={!audioPlayer.currentSong}
          >
            <MdSkipNext size={20} />
          </button>
        </div>

        <div className="player-center">
          <div className="progress-bar">
            <span className="time-current">{formatTime(audioPlayer.currentTime)}</span>
            <div 
              className="progress-track"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = x / rect.width;
                audioPlayer.seekTo(percentage * audioPlayer.duration);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="progress-fill"
                style={{ 
                  width: `${audioPlayer.duration > 0 ? (audioPlayer.currentTime / audioPlayer.duration) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <span className="time-total">{formatTime(audioPlayer.duration)}</span>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-controls">
            <EmojiReaction onEmojiSelect={handleEmojiSelect} />
            <VolumeControl
              volume={audioPlayer.volume}
              onVolumeChange={audioPlayer.setVolume}
              onToggleMute={audioPlayer.toggleMute}
            />
            <PlaybackSpeedControl
              speed={audioPlayer.playbackRate}
              onChange={audioPlayer.setPlaybackRate}
            />
            <button 
              className={`volume-btn ${audioPlayer.isRepeat ? 'liked' : ''}`}
              onClick={audioPlayer.toggleRepeat}
            >
              <MdRepeat size={18} />
            </button>
            <button 
              className={`volume-btn ${audioPlayer.isShuffle ? 'liked' : ''}`}
              onClick={audioPlayer.toggleShuffle}
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

      <GenreSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveGenres} 
      />
    </div>
  );
};

export default Dashboard;
*/