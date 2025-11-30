import React from 'react';
import './TrackingSection.css';

const TrackingSection: React.FC = () => {
  return (
    <div className="tracking-section">
      <div className="tracking-gallery">
        <div className="tracking-card">
          <div className="tracking-image-container" style={{backgroundImage: "url('/assets/images/elderly-man 1.png')", backgroundColor: '#FFA500'}}>
          </div>
          <div className="tracking-content">
            <h3>Creating Life's Playlist</h3>
            <p>Creating a truly effective custom music playlist for someone with dementia hinges on deep personalization rooted in their life history and musical preferences. The goal is to choose music that is highly familiar and emotionally significant, typically focusing on popular songs, hymns, or genres from the person’s late adolescence and early adulthood (roughly ages 15 to 30), as this period often yields the strongest memory recall. BrainTest Music provides an easy means of creating your life’s playlist and allowing you to access it anywhere you go.</p>
          </div>
        </div>
        <div className="tracking-card">
          <div className="tracking-image-container" style={{backgroundImage: "url('/assets/images/elderly-man 2.png')", backgroundColor: '#90EE90'}}>
          </div>
          <div className="tracking-content">
            <h3>Listening to Favorites</h3>
            <p>Listening to favorite music is one of the most accessible and profound therapeutic interventions for individuals with dementia. When a person hears a song that holds deep personal meaning, it often bypasses the damaged cognitive centers and directly accesses the emotional and memory processing areas of the brain that remain relatively preserved. This process can lead to a transformation, where a previously withdrawn or agitated person may become visibly calm, engaged, and alert. The familiar melodies and rhythms can help to reduce anxiety and depressive symptoms, prompt singing or movement, and facilitate a recollection of cherished memories, providing valuable moments of authentic self-expression and connection with caregivers in the present.</p>
          </div>
        </div>
        <div className="tracking-card">
          <div className="tracking-image-container" style={{backgroundImage: "url('/assets/images/elderly-woman 1.png')", backgroundColor: '#FFA500'}}>
          </div>
          <div className="tracking-content">
            <h3>Tracking Mood</h3>
            <p>Tracking the mood of someone with dementia requires a patient and observant approach, as verbal reports of feelings may be unreliable or impossible due to cognitive decline. Instead of relying solely on questions, caregivers should focus on documenting non-verbal cues and behavioral patterns throughout the day. BrainTest Music keeps a simple mood journal that correlates behaviors with the time of day, music being played, environment, recent events (e.g., “agitated after lunch during loud TV show” or “calm while listening to music at 3 PM”). This detailed tracking helps to identify potential triggers for distress and effective interventions or routines that promote comfort and a positive emotional state.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingSection;
