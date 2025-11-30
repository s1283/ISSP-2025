import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder, MdPlayArrow, MdPause } from 'react-icons/md';
import './PlaylistCard.css';

interface Playlist {
  name: string;
  genres: string[];
}

interface PlaylistCardProps {
  playlist: Playlist;
  isLiked?: boolean;
  onPlay?: (playlist: Playlist) => void;
  onDelete?: (playlistName: string) => void;
  isPlaying?: boolean;
  isCurrentPlaylist?: boolean;
  onTogglePlay?: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ 
  playlist, 
  isLiked: initialLiked = false,
  onPlay,
  onDelete,
  isPlaying = false,
  isCurrentPlaylist = false,
  onTogglePlay
}) => {
  const navigate = useNavigate();
  
  // Load liked state from localStorage
  const getLikedState = () => {
    const likedPlaylists = localStorage.getItem('likedPlaylists');
    if (likedPlaylists) {
      const parsed = JSON.parse(likedPlaylists);
      return parsed[playlist.name] ?? initialLiked;
    }
    return initialLiked;
  };
  
  const [isLiked, setIsLiked] = useState(() => getLikedState());

  // Update liked state when playlist changes or on mount
  useEffect(() => {
    setIsLiked(getLikedState());
  }, [playlist.name]);

  const handleCardClick = () => {
    navigate(`/playlist/${encodeURIComponent(playlist.name)}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    
    // Persist to localStorage
    const likedPlaylists = localStorage.getItem('likedPlaylists');
    const parsed = likedPlaylists ? JSON.parse(likedPlaylists) : {};
    parsed[playlist.name] = newLikedState;
    localStorage.setItem('likedPlaylists', JSON.stringify(parsed));
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaylist && isPlaying && onTogglePlay) {
      // If this playlist is currently playing, toggle pause
      onTogglePlay();
    } else if (onPlay) {
      // Start playing this playlist
      onPlay(playlist);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(playlist.name);
    }
  };

  return (
    <div className="playlist-card" onClick={handleCardClick}>
      <div className="playlist-background">
        <div className="playlist-title" title={playlist.name}>
          {playlist.name}
        </div>
        
        <div className="playlist-controls">
          <button 
            className={`control-button heart-btn ${isLiked ? 'liked' : ''}`}
            aria-label={`${isLiked ? 'Unlike' : 'Like'} ${playlist.name} playlist`}
            onClick={handleLikeClick}
          >
            {isLiked ? <MdFavorite size={42} /> : <MdFavoriteBorder size={42} />}
          </button>
          
          <div className="play-button-container">
            <button 
              className="play-button"
              aria-label={`${(isCurrentPlaylist && isPlaying) ? 'Pause' : 'Play'} ${playlist.name} playlist`}
              onClick={handlePlayClick}
            >
              {(isCurrentPlaylist && isPlaying) ? <MdPause size={32} /> : <MdPlayArrow size={32} />}
            </button>
          </div>
          
          <button 
            className="control-button delete-btn" 
            aria-label={`Delete ${playlist.name} playlist`}
            onClick={handleDeleteClick}
          >
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
              <path d="M16 18V30M20 18V30M24 18V30M28 18V30M12 14H30M26 14V12C26 11.4696 25.7893 10.9609 25.4142 10.5858C25.0391 10.2107 24.5304 10 24 10H18C17.4696 10 16.9609 10.2107 16.5858 10.5858C16.2107 10.9609 16 11.4696 16 12V14" stroke="#1D1B20" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
