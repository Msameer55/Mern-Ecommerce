import React from "react";
import GenderCollection from "../Products/GenderCollection";
import HeroSection from "../Common/HeroSection";
import NewArrivals from "../Products/NewArrivals";
import FeaturedProduct from "../Products/FeaturedProduct";
import FeaturedImages from "../FeaturedImages";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterProductsByQuery } from "../../redux/slice/productSlice";
import BestSellers from "../Products/BestSellers";

const Home = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(filterProductsByQuery({}));
  }, []);

  return (
    <>
      <HeroSection />
      <FeaturedImages />
      <h2 className="text-7xl font-medium tracking-tighter text-center my-10">The biggest labels</h2>
      <GenderCollection category="Women" />
      <GenderCollection category="Men" />
      <GenderCollection category="Bottom Wear" />
      <GenderCollection category="Top Wear" />
      <BestSellers />
      <FeaturedProduct />
      <NewArrivals />
    </>
  );
};

export default Home;
