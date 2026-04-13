import React, { useRef, useEffect, useState } from "react";
import Product from "./Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductList from "./ProductListSwiper";
import { fakeData } from "../fakeData/ProductData";

const NewArrivals = () => {
  const newArrival = fakeData.slice(0, 5);

  return (
    <section className=" px-4 relative">
      <ProductList
        title="New Arrivals"
        products={newArrival}
        isSwiper={true} // Toggle this to false for grid layout
      />
    </section>
  );
};

export default NewArrivals;
