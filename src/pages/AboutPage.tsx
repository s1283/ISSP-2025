import React from 'react';
import './styles/AboutBrainTest.css';
import { usePageTitle } from './hooks/usePageTitle';

const AboutPage: React.FC = () => {
  usePageTitle('About');
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Taken in the comfort of your home. No appointment needed.</h1>
          <h2>You only need 15 mins & BrainTest®</h2>
          <a href="https://app.braintest.com/" className="btn-signup">Sign up now</a>
        </div>
      </section>

      {/* How BrainTest Works */}
      <section className="how-it-works">
        <div className="section-container">
          <h1>How does BrainTest work?</h1>
          <p className="subtitle">TAKE IT IN <strong>15 MINS</strong> AND GET YOUR <strong>RESULTS IN 3 DAYS OR LESS</strong></p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Take Your First Test</h3>
                <p>Your first test is used as your Baseline score, which sets the bar as a reference point to compare and track future results. The questions in BrainTest are specifically designed to assess how well you are currently thinking and remembering things.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Review Results</h3>
                <p>You will be notified when your results are ready. You will receive a printable detailed report of your score and a video explanation by a certified doctor.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Track Performance</h3>
                <p>BrainTest is specially designed to be taken every 6 months, and it will notify you for the next test. As you complete future tests, you will be able to see any changes in your performance.</p>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="note-section">
            <div className="note-icon">!</div>
            <div className="note-content">
              <h4>NOTE</h4>
              <p>Your first BrainTest score establishes a baseline to compare your future results. There are different versions of the test so it will be different each time you take it, and no studying is needed. BrainTest evaluates your thinking abilities, testing key aspects of cognition including memory, problem solving, and language. These key aspects of cognition can be affected by Alzheimer's Disease, Dementia, and Mild Cognitive Impairment (MCI) which can be easy to miss during a regular doctor's visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Science Section */}
      <section className="science-section">
        <div className="section-container">
          <div className="science-grid">
            <div className="science-text">
              <h1>The Science behind BrainTest</h1>
              <p>BrainTest is based on the Self-administered Gerocognitive Examination (SAGE), created by Dr. Douglas Scharre, Professor of Clinical Neurology and Psychiatry at Ohio State University's Wexner Medical Center. The SAGE is a scientifically proven assessment for Mild Cognitive Impairment (MCI) and early dementia, and is being used in numerous clinical settings.</p>
              <a href="/science" className="btn-outline">LEARN MORE</a>
            </div>
            <div className="science-image">
              <img src="/public/assets/images/brain-science.png" alt="Brain Science" />
            </div>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section className="plan-section">
        <div className="section-container">
          <h4>ABOUT OUR PLAN</h4>
          <h1>Semi-Annual Wellness Plan</h1>
          <div className="plan-features">
            <h3>30-Day Free Trial</h3>
            <span className="plus">+</span>
            <h3>Long term observation</h3>
          </div>
          <p className="plan-description">Your plan starts with one free test, plus 30-day free access to our full product to try. After the free trial period, you will get a new test every six months to monitor your brain health, plus unlimited access to our full product.</p>
          <p className="small-text">Charges will apply after 30-Day Free Trial ends.</p>
          <a href="https://braintest.com/subscription-page/" className="btn-primary">LEARN MORE</a>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <h1>Still have questions?</h1>
          <p className="faq-subtitle">Check out our FAQ section for some of the most commonly asked questions.</p>
          
          <div className="faq-list">
            <details className="faq-item">
              <summary>Why does it need my payment information when starting my free trial?</summary>
              <p>This is needed to reserve your paid subscription and also allow us to monitor who has had a trial or not. Each member is allowed for one free trial. During the 30 days free trial, we can ensure you that you are not charged and you can cancel your subscription anytime.</p>
            </details>

            <details className="faq-item">
              <summary>Why can't I see what I got wrong on BrainTest?</summary>
              <p>BrainTest is a unique test meant to help detect cognitive impairments. In order to not affect future test results, the marking schema is not included.</p>
            </details>

            <details className="faq-item">
              <summary>Why can't I download BrainTest app on my phone?</summary>
              <p>BrainTest is only available on Tablet. Due to the design and clinical validation of mimicking the paper test, it is designed to only be available on tablet.</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;