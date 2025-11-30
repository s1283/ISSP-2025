import React, { useState } from 'react';
import './styles/Contact.css';
import { usePageTitle } from './hooks/usePageTitle';

const Contact: React.FC = () => {
  usePageTitle('Contact - BrainTest');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all fields.'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // Simulate form submission (replace with actual API call)
    console.log('Form submitted:', formData);
    
    setFormStatus({
      type: 'success',
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Clear success message after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: null, message: '' });
    }, 5000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact</h1>
          <p>Do you have a question or comment for us?</p>
          <p>Please fill out the form below or contact us by phone or email anytime using the coordinates shown on this page.</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Contact Form */}
          <main className="contact-main">
            <div className="contact-form-wrapper">
              <h2>Contact Us</h2>
              <hr className="form-divider" />
              
              {formStatus.message && (
                <div className={`form-message ${formStatus.type}`}>
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message"
                    className="form-textarea"
                    rows={10}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Send
                </button>
              </form>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="contact-sidebar">
            {/* Media Inquiries */}
            <div className="sidebar-box">
              <h3 className="box-title">All Media inquiries</h3>
              <div className="box-content">
                <p>
                  <strong>Michael Kader</strong><br />
                  Email: <a href="mailto:press@braintest.com">press@braintest.com</a><br />
                  Tel: <a href="tel:+16143889550">+1 614 388 9550</a>
                </p>
              </div>
            </div>

            {/* Locations */}
            <div className="sidebar-box">
              <h3 className="box-title">Locations</h3>
              <div className="box-content">
                <div className="location">
                  <strong>BrainTest – United States</strong><br />
                  35 E. Gay Street, Suite 314,<br />
                  Columbus, OH, USA 43215
                </div>

                <div className="location">
                  <strong>BrainTest – Canada</strong><br />
                  820 – 1075 W Georgia Street<br />
                  Vancouver, BC Canada V6E 3C9
                </div>

                <div className="location">
                  <strong>BrainTest – Global Headquarters</strong><br />
                  Box 10315, 68 West Bay Road Grand<br />
                  Cayman, Cayman Islands KY1-1102
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default Contact;