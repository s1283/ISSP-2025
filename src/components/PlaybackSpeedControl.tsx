import React, { useState } from 'react';
import { MdSpeed } from 'react-icons/md';
import './PlaybackSpeedControl.css';

interface PlaybackSpeedControlProps {
  speed: number;
  onChange: (speed: number) => void;
}

const PlaybackSpeedControl: React.FC<PlaybackSpeedControlProps> = ({ speed, onChange }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const speeds = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  const handleSpeedClick = (newSpeed: number) => {
    onChange(newSpeed);
    setShowMenu(false);
  };

  return (
    <div 
      className="speed-control-container"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <button className="speed-button">
        <MdSpeed size={24} />
        <span className="speed-label">{speed}x</span>
      </button>
      
      {showMenu && (
        <div className="speed-menu">
          {speeds.map((speedOption) => (
            <button
              key={speedOption}
              className={`speed-option ${speed === speedOption ? 'active' : ''}`}
              onClick={() => handleSpeedClick(speedOption)}
            >
              {speedOption}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaybackSpeedControl;
