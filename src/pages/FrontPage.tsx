import React from 'react';
import HeroSection from '../components/HeroSection';
import BenefitsSection from '../components/BenefitsSection';
import TrackingSection from '../components/TrackingSection';
import HowWorksSection from '../components/HowWorksSection';

const FrontPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <TrackingSection />
      <HowWorksSection />
    </>
  );
};

export default FrontPage;
