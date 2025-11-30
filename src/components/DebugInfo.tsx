import React, { useState, useEffect } from 'react';

const DebugInfo: React.FC = () => {
  const [screenSize, setScreenSize] = useState('');
  const [imagesCount, setImagesCount] = useState(0);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize(`${window.innerWidth}x${window.innerHeight}`);
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
    };
  }, []);

  useEffect(() => {
    // Listen for image load events globally
    const handleImageLoad = () => {
      setImagesCount(prev => prev + 1);
    };

    // Add event listeners to existing images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        setImagesCount(prev => prev + 1);
      } else {
        img.addEventListener('load', handleImageLoad);
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
      });
    };
  }, []);

  return (
    <div className="debug-info">
      <div>Screen: <span>{screenSize}</span></div>
      <div>Images loaded: <span>{imagesCount}</span></div>
    </div>
  );
};

export default DebugInfo;