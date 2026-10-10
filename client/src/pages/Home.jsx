import React from 'react'
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import DashboardPreview from "../components/DashboardPreview";
import WhyFinMate from "../components/WhyFinMate";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
function Home() {
  return (
    <div>
    <Navbar />

      <Hero />
      <Features />
      <DashboardPreview />
      <WhyFinMate />
      <CTA />

      <Footer />
      
    </div>
  )
}

export default Home
