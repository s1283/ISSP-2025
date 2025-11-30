import React from 'react';

const HowWorksSection: React.FC = () => {
  return (
    <section className="how-works-section content-section">
      <div className="section-container">
        <div className="section-content-layout">
          <div>
            <h2 className="section-title">How it works</h2>
            <p className="section-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="image-container-grid">
            <img src="/assets/images/side-view-senior-man-enjoying-music.png" alt="Man listening to music" className="grid-image" />
            <img src="/assets/images/elderly-man 1.png" alt="Close up of a senior man" className="grid-image" />
            <img src="/assets/images/senior-woman-dancing-listening-music.png" alt="Woman listening to music" className="grid-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorksSection;
