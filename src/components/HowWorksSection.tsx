import React from 'react';
import './HowWorksSection.css';

const HowWorksSection: React.FC = () => {
  return (
    <div className="how-works-section">
      <div className="how-works-content">
        <div className="how-works-text">
          <h2>How it works</h2>
          <p>
            Listening to or engaging with familiar music, especially songs from a
            person’s youth, can trigger powerful autobiographical memories and
            emotional responses, providing moments of clarity and connection
            that may be difficult to achieve through verbal communication.
          </p>
          <p>
            This musical engagement helps to alleviate common psychological
            symptoms like anxiety, agitation, and depression, and can even improve
            cognitive functions such as attention and speech.
          </p>
        </div>
        <div className="how-works-image-container">
          <img src="/assets/images/senior-woman-dancing-listening-music.png" alt="Woman listening to music" />
        </div>
      </div>
    </div>
  );
};

export default HowWorksSection;
