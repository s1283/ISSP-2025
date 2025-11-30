import React from 'react';
import './GenreSelectionModal.css';

const musicGenres = [
    'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Blues', 'Country', 'Electronic', 
    'R&B', 'Reggae', 'Classical', 'Metal', 'Indie', 'Folk', 'Soul', 'Funk', 'Latin'
  ];

interface GenreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedGenres: string[]) => void;
}

const GenreSelectionModal: React.FC<GenreSelectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Your Genres</h2>
        <div className="genre-grid">
          {musicGenres.map(genre => (
            <button
              key={genre}
              type="button"
              className={`genre-chip ${selectedGenres.includes(genre) ? 'selected' : ''}`}
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="close-button">Close</button>
          <button onClick={() => onSave(selectedGenres)} className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default GenreSelectionModal;
