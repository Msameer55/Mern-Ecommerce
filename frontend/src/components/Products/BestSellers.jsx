import React, { useRef, useEffect, useState } from "react";
import Product from "./Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductList from "./ProductListSwiper";
import { useDispatch, useSelector } from "react-redux";
import { bestSellersProduct } from "../../redux/slice/productSlice";

const BestSellers = () => {
    const { bestSeller, loading, error } = useSelector((state) => state.product);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(bestSellersProduct()).unwrap().catch((error) => {
            console.log(error);
        });
    }, [dispatch])
    return (
        <section className="px-4 relative mb-16">

            <ProductList
                products={bestSeller}
                isSwiper={true}
                title={"Best Seller"}
            />

        </section>
    );
};

export default BestSellers;
