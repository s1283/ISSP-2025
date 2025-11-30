
import React from 'react';
import './BenefitsSection.css';

const BenefitsSection: React.FC = () => {
  return (
    <div className="benefits-section">
      <div className="benefits-content">
        <h2>Benefits of Music</h2>
        <p>
          Music offers significant therapeutic benefits for individuals living with
          dementia and Alzheimer's disease, primarily by tapping into areas of
          the brain that often remain intact long after other memories fade.
        </p>
        <p>
          Incorporating music therapy—whether through listening, singing,
          or movement—enhances the overall quality of life for patients and
          fosters positive, meaningful interactions between them and their
          caregivers.
        </p>
      </div>
      <div className="benefits-image">
        <img src="/assets/images/side-view-senior-man-enjoying-music.png" alt="Man listening to music" />
      </div>
    </div>
  );
};

export default BenefitsSection;
