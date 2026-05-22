import React, { useRef, useEffect, useState } from "react";
import Product from "./Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductList from "./ProductListSwiper";
import { useDispatch, useSelector } from "react-redux";
import { newArrivalProduct } from "../../redux/slice/productSlice";

const NewArrivals = () => {

  const { newArrival, loading, error } = useSelector((state) => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(newArrivalProduct());
  }, [dispatch])

  return (
    <section className="px-4 relative mb-16">
      <ProductList products={newArrival} isSwiper={true} title={"New Arrivals"} />

    </section>
  );
};

export default NewArrivals;
