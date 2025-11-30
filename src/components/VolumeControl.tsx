import React, { useState } from 'react';
import { MdVolumeUp, MdVolumeOff, MdVolumeDown, MdVolumeMute } from 'react-icons/md';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({ volume, onVolumeChange, onToggleMute }) => {
  const [showSlider, setShowSlider] = useState(false);

  const getVolumeIcon = () => {
    if (volume === 0) return <MdVolumeOff size={18} />;
    if (volume < 0.3) return <MdVolumeMute size={18} />;
    if (volume < 0.7) return <MdVolumeDown size={18} />;
    return <MdVolumeUp size={18} />;
  };

  return (
    <div 
      className="volume-control-container"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button 
        className="volume-btn" 
        onClick={onToggleMute}
        aria-label="Toggle mute"
      >
        {getVolumeIcon()}
      </button>
      
      {showSlider && (
        <div className="volume-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
            className="volume-slider"
            style={{ '--volume-percentage': `${volume * 100}%` } as React.CSSProperties}
            aria-label="Volume"
          />
          <span className="volume-percentage">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
