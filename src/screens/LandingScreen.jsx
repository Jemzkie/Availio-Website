import React from "react";
import FirstSection from "../components/Landing/FirstSection";
import DealsSection from "../components/Landing/DealsSection";
import StatsSection from "../components/Landing/StatsSection";
import DownloadAppSection from "../components/Landing/DownloadAppSection";
import Footer from "../components/General/Footer";
function HeroSection() {
  const ViewData = "Landing";
  return (
    <div className="w-full h-auto overflow-x-hidden pt-12">
      <FirstSection ViewData={ViewData} />
      <StatsSection />
      <DealsSection />
      <DownloadAppSection />
      <Footer />
    </div>
  );
}

export default HeroSection;
