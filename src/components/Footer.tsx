import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main-links">
            <a href="https://braintest.com/about-braintest/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>About BrainTest</a>
            <a href="https://braintest.com/blog/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Blog</a>
            <a href="https://braintest.com/about-us/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Team</a>
            <a href="https://braintest.com/the-science/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>The Science</a>
            <a href="https://braintest.com/knowledge/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Knowledge Center</a>
            <a href="https://braintest.com/contact/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Contact</a>
          </div>
          <div className="footer-social">
            <a href="https://www.linkedin.com/company/braintest/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(14px, 1.5vw, 16px)'}}>Follow Us</a>
          </div>
          <div className="footer-bottom-links">
            <a href="https://braintest.com/terms/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Terms of Use</a>
            <a href="https://braintest.com/privacy/" style={{background: 'none', border: 'none', color: '#F2F2F2', cursor: 'pointer', fontSize: 'clamp(12px, 1.3vw, 14px)'}}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
