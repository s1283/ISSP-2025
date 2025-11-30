import React, { useState } from 'react';

const BenefitsSection: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Benefits image loaded');
  };

  return (
    <section className="benefits-section content-section">
      <div className="section-container">
        <div className="section-content-layout">
          <div>
            <h2 className="section-title">Benefits of Music</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="image-container">
            {!imageError ? (
              <img 
                src="/assets/images/side-view-senior-man-enjoying-music.png" 
                alt="Senior enjoying music" 
                className="section-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <div className="image-error section-image">
                Image not found: Senior enjoying music
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;