import React from 'react'
import HeroSection from "./HeroSection";
import FeaturedJobs from '../components/Home/FeaturedJobs';
import HowItWorks from '../components/Home/HowItWorks';
import Testimonials from '../components/Home/Testimonials';

function Home() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
    </div>
  )
}

export default Home