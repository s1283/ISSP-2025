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
              Music offers significant therapeutic benefits for individuals living with
              dementia and Alzheimer's disease, primarily by tapping into areas of
              the brain that often remain intact long after other memories fade.
            </p>
            <p className="section-text">
              Incorporating music therapy—whether through listening, singing,
              or movement—enhances the overall quality of life for patients and
              fosters positive, meaningful interactions between them and their
              caregivers.
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