import React, { useState, useRef, useEffect } from 'react';
import { MdAddReaction } from 'react-icons/md';
import './EmojiReaction.css';

const EMOJIS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '⚡', label: 'Energetic' },
  { emoji: '🧘', label: 'Calm' },
];

interface EmojiReactionProps {
  onEmojiSelect: (emoji: string) => void;
}

const EmojiReaction: React.FC<EmojiReactionProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="emoji-reaction-container" ref={containerRef}>
      <button className="emoji-reaction-button" onClick={() => setIsOpen(!isOpen)}>
        <MdAddReaction size={24} />
      </button>
      {isOpen && (
        <div className="emoji-picker">
          {EMOJIS.map(({ emoji, label }) => (
            <div
              key={emoji}
              className={`emoji-item ${selectedEmoji === emoji ? 'selected' : ''}`}
              onClick={() => handleEmojiClick(emoji)}
            >
              <span className="emoji">{emoji}</span>
              <span className="emoji-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmojiReaction;
