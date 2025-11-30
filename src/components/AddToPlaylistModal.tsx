import React, { useState } from 'react';
import './AddToPlaylistModal.css';
import { Song } from '../data/musicLibrary';

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  onConfirm: (playlistId: string) => void;
  onCreateNew: (playlistName: string) => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlists,
  onConfirm,
  onCreateNew,
}) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreateNew(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  return (
    <div className="add-to-playlist-modal-backdrop" onClick={onClose}>
      <div className="add-to-playlist-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Add to Playlist</h4>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <div className="new-playlist-section">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="New playlist name"
          />
          <button onClick={handleCreate}>Create</button>
        </div>

        <ul className="playlist-list">
          {playlists.map((p) => (
            <li key={p.id} onClick={() => onConfirm(p.id)}>
              {p.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
