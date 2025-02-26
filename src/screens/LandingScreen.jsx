import React from "react";
import FirstSection from "../components/Landing/FirstSection";
import DealsSection from "../components/Landing/DealsSection";
import StatsSection from "../components/Landing/StatsSection";
import DownloadAppSection from "../components/Landing/DownloadAppSection";
function HeroSection() {
  return (
    <div className="w-full h-auto pb-32">
      <FirstSection />
      <StatsSection />
      <DealsSection />
      <DownloadAppSection />
    </div>
  );
}

export default HeroSection;
