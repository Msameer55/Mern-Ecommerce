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

      {/* Softer Gradient Overlay */}
      <div className="hidden absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30  items-center justify-center text-center px-4">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl md:text-5xl tracking-tighter font-bold mb-4 uppercase">
            Discover Your Style
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Explore the latest fashion trends for men and women
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
