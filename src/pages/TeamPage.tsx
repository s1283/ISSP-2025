import React, { useState } from 'react';
import { usePageTitle } from './hooks/usePageTitle';
import './styles/Team.css';

interface TeamMember {
  firstName: string;
  lastName: string;
  role: string;
  organization?: string;
  image?: string;
}

const TheTeam: React.FC = () => {
  usePageTitle('About Us');

  // Single placeholder image for all team members
  const PLACEHOLDER_IMAGE = '/assets/images/placeholder.jpg';

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => new Set(prev).add(imagePath));
  };

  const brainTestTeam: TeamMember[] = [
    {
      firstName: 'Frederick',
      lastName: 'Ghahramani',
      role: 'Founder, BrainTest',
      image: '/assets/images/team/frederick-ghahramani.jpg'
    },
    {
      firstName: 'Michael',
      lastName: 'Kader',
      role: 'President & Legal Counsel',
      image: '/assets/images/team/michael-kader.jpg'
    },
    {
      firstName: 'Terence',
      lastName: 'Lee',
      role: 'Director of Product',
      image: '/assets/images/team/terence-lee.jpg'
    },
    {
      firstName: 'Michael',
      lastName: 'Rubin',
      role: 'Director of Business Development',
      image: '/assets/images/team/michael-rubin.jpg'
    },
    {
      firstName: 'John',
      lastName: 'Shwaluk',
      role: 'Technical Lead',
      image: '/assets/images/team/john-shwaluk.jpg'
    }
  ];

  const advisoryBoard: TeamMember[] = [
    {
      firstName: 'Dr.',
      lastName: 'Scharre, MD',
      role: 'Head of Medical Affairs',
      organization: 'Ohio State University',
      image: '/assets/images/team/dr-douglas-w-scharre.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Borson, MD',
      role: 'Psychiatry',
      organization: 'University of Washington',
      image: '/assets/images/team/dr-soo-borson.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Cummings, MD, ScD',
      role: 'Neurology',
      organization: 'Cleveland Clinic',
      image: '/assets/images/team/dr-jeffrey-l-cummings.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Grover, MD, MPA',
      role: 'Epidemiology',
      organization: 'McGill University',
      image: '/assets/images/team/dr-steven-a-grover.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Tangalos, MD',
      role: 'Geriatric & Internal Medicine',
      organization: 'Mayo Clinic',
      image: '/assets/images/team/dr-eric-g-tangalos.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Tariot, MD',
      role: 'Neuropharmacology',
      organization: "Banner Alzheimer's Institute",
      image: '/assets/images/team/dr-pierre-n-tariot.jpg'
    },
    {
      firstName: 'Dr.',
      lastName: 'Trzepacz, MD',
      role: 'Medical Executive',
      organization: 'Indiana University',
      image: '/assets/images/team/dr-paula-terese-trzepacz.jpg'
    }
  ];

  const bcitTeam: TeamMember[] = [
    {
      firstName: 'Jakob',
      lastName: 'Dimou',
      role: 'Backend',
      image: '/assets/images/team/jakob-dimou.jpg'
    },
    {
      firstName: 'Stanley',
      lastName: 'Chu',
      role: 'Frontend, Backend',
      image: '/assets/images/team/stanley-chu.jpg'
    },
    {
      firstName: 'Alexis',
      lastName: 'Ingente',
      role: 'Frontend, Backend',
      image: '/assets/images/team/alexis-ingente.jpg'
    },
    {
      firstName: 'Nana',
      lastName: 'Sim',
      role: 'Frontend',
      image: '/assets/images/team/nana-sim.jpg'
    },
    {
      firstName: 'Collin',
      lastName: 'Fung',
      role: 'Backend',
      image: '/assets/images/team/collin-fung.jpg'
    },
    {
      firstName: 'Julie',
      lastName: 'Hoang',
      role: 'Frontend',
      image: '/assets/images/team/julie-hoang.jpg'
    },
    {
      firstName: 'Jerry',
      lastName: 'Hunt',
      role: 'Backend',
      image: '/assets/images/team/jerry-hunt.jpg'
    }
  ];

  return (
    <div className="team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <div className="team-hero-content">
          <h1>About Us</h1>
          <p className="team-intro">
            BrainTest is a medical software company that provides scientifically validated 
            cognitive screening instruments on a wide range of tablets and mobile devices. 
            The company empowers patients to monitor their cognition and learn objective 
            evidence-based recommendations about their brain health in the comfort and 
            privacy of their own homes.
          </p>
          <p className="team-partnership">
            Through its partnership with The Ohio State University, BrainTest holds the 
            exclusive digital rights to the Self-Administered Gerocognitive Examination (SAGE Test).
          </p>
        </div>
      </section>

      {/* BrainTest Team */}
      <section className="team-section">
        <div className="section-container">
          <h2 className="team-section-title">BrainTest Team</h2>
          <div className="team-grid team-grid-3">
            {brainTestTeam.map((member, index) => {
              const imageSrc = member.image || PLACEHOLDER_IMAGE;
              const displayImage = imageErrors.has(imageSrc) ? PLACEHOLDER_IMAGE : imageSrc;
              
              return (
                <div key={index} className="team-card">
                  <div className="team-photo">
                    <img 
                      src={displayImage}
                      alt={`${member.firstName} ${member.lastName}`}
                      onError={() => handleImageError(imageSrc)}
                    />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">
                      <span className="team-firstname">{member.firstName}</span>{' '}
                      <span className="team-lastname">{member.lastName}</span>
                    </h3>
                    <p className="team-role">{member.role}</p>
                    {member.organization && (
                      <p className="team-org">{member.organization}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="advisory-section">
        <div className="section-container">
          <h2 className="team-section-title">BrainTest Scientific Advisory Board</h2>
          <div className="team-grid team-grid-4">
            {advisoryBoard.map((member, index) => {
              const imageSrc = member.image || PLACEHOLDER_IMAGE;
              const displayImage = imageErrors.has(imageSrc) ? PLACEHOLDER_IMAGE : imageSrc;
              
              return (
                <div key={index} className="team-card">
                  <div className="team-photo">
                    <img 
                      src={displayImage}
                      alt={`${member.firstName} ${member.lastName}`}
                      onError={() => handleImageError(imageSrc)}
                    />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">
                      <span className="team-firstname">{member.firstName}</span>{' '}
                      <span className="team-lastname">{member.lastName}</span>
                    </h3>
                    <p className="team-role">{member.role}</p>
                    {member.organization && (
                      <p className="team-org">{member.organization}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BCIT students */}
      <section className="team-section">
        <div className="section-container">
          <h2 className="team-section-title">BCIT Student Development Team</h2>
          <div className="team-grid team-grid-4">
            {bcitTeam.map((member, index) => {
              const imageSrc = member.image || PLACEHOLDER_IMAGE;
              const displayImage = imageErrors.has(imageSrc) ? PLACEHOLDER_IMAGE : imageSrc;
              
              return (
                <div key={index} className="team-card">
                  <div className="team-photo">
                    <img 
                      src={displayImage}
                      alt={`${member.firstName} ${member.lastName}`}
                      onError={() => handleImageError(imageSrc)}
                    />
                  </div>
                  <div className="team-info">
                    <h3 className="team-name">
                      <span className="team-firstname">{member.firstName}</span>{' '}
                      <span className="team-lastname">{member.lastName}</span>
                    </h3>
                    <p className="team-role">{member.role}</p>
                    {member.organization && (
                      <p className="team-org">{member.organization}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="section-container">
          <div className="contact-grid">
            <div className="contact-card">
              <h3>Contact Us</h3>
              <p className="contact-hours">Monday to Friday, 8am - 5pm PST</p>
              <div className="contact-info">
                <p><strong>USA & Canada</strong><br />1-866-933-6698</p>
                <p><strong>International</strong><br />+1-614-412-2209</p>
              </div>
              <a href="/contact" className="btn-contact">Contact Us</a>
            </div>

            <div className="contact-card">
              <h3>Locations</h3>
              <div className="location-info">
                <div className="location">
                  <strong>BrainTest – United States</strong>
                  <p>35 E. Gay Street, Suite 314,<br />Columbus, OH, USA 43215</p>
                </div>
                <div className="location">
                  <strong>BrainTest – Canada</strong>
                  <p>820 – 1075 W Georgia Street<br />Vancouver, BC Canada V6E 3C9</p>
                </div>
                <div className="location">
                  <strong>BrainTest – Global Headquarters</strong>
                  <p>Box 10315, 68 West Bay Road Grand<br />Cayman, Cayman Islands KY1-1102</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheTeam;