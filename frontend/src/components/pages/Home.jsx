import React from "react";
import GenderCollection from "../Products/GenderCollection";
import HeroSection from "../Common/HeroSection";
import NewArrivals from "../Products/NewArrivals";
import FeaturedProduct from "../Products/FeaturedProduct";
import FeaturedImages from "../FeaturedImages";
const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedImages />
      <h2 className="text-7xl font-medium tracking-tighter text-center my-10">The biggest labels</h2>
      <GenderCollection category="womens"/>
      <GenderCollection category="mens"/>
      <NewArrivals />
      <FeaturedProduct />
    </>
  );
};

export default Home;
