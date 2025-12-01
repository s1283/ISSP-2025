import React, { useState } from 'react';

interface ImageState {
  elderly: boolean;
  headphones: boolean;
  woman: boolean;
}

const TrackingSection: React.FC = () => {
  const [imageErrors, setImageErrors] = useState<ImageState>({
    elderly: false,
    headphones: false,
    woman: false
  });

  const handleImageError = (imageType: keyof ImageState) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }));
  };

  const handleImageLoad = () => {
    console.log('Tracking image loaded');
  };

  const renderImage = (
    src: string, 
    alt: string, 
    errorKey: keyof ImageState, 
    fallbackText: string
  ) => {
    return imageErrors[errorKey] ? (
      <div className="image-error section-image">
        Image not found: {fallbackText}
      </div>
    ) : (
      <img 
        src={src}
        alt={alt}
        className="section-image"
        onLoad={handleImageLoad}
        onError={() => handleImageError(errorKey)}
      />
    );
  };

  return (
    <section className="tracking-section content-section">
      <div className="section-container">
        <div className="section-content-layout">
          <div>
            <h2 className="section-title">Tracking Mood</h2>
            <p className="section-text">
            Creating a truly effective custom music playlist for someone with 
            dementia hinges on deep personalization rooted in their life history and musical preferences. 
            The goal is to choose music that is highly familiar and emotionally significant, 
            typically focusing on popular songs, hymns, or genres from the person’s 
            late adolescence and early adulthood (roughly ages 15 to 30), 
            as this period often yields the strongest memory recall.
            </p>
            <p className="section-text">
            BrainTest Music provides an easy means of creating your life’s playlist and allowing you to access it anywhere you go.
            </p>
            
            <div className="image-grid">
              <div className="image-container">
                {renderImage(
                  "/assets/images/elderly-man 1.png",
                  "Elderly man",
                  "elderly",
                  "Elderly man"
                )}
              </div>
              <div className="image-container">
                {renderImage(
                  "/assets/images/senior-enjoying-music-headphones 1.png",
                  "Senior with headphones",
                  "headphones",
                  "Senior with headphones"
                )}
              </div>
              <div className="image-container">
                {renderImage(
                  "/assets/images/elderly-woman 1.png",
                  "Elderly woman",
                  "woman",
                  "Elderly woman"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;