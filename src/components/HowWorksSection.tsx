import React from 'react';

const HowWorksSection: React.FC = () => {
  return (
    <section className="how-works-section content-section">
      <div className="section-container">
        <div className="section-content-layout">
          <div>
            <h2 className="section-title">How it works</h2>
            <p className="section-text">
            Listening to or engaging with familiar music can trigger memories 
            from a person’s youth, powerful autobiographical memories, and 
            emotions of clarity and connection. 
            This may enable communication through verbal means.
            </p>
            <p className="section-text">
            BrainTest Music provides an easy means of creating your life’s playlist 
            and allowing you to access it anywhere you go.
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
