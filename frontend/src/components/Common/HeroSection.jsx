import React from "react";

const HeroSection = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <img
        src="/assets/desktop-hero-banner.webp"
        alt="Hero Banner"
        className=" h-full w-full object-cover"
      />
    </div>
  );
};

export default HeroSection;
