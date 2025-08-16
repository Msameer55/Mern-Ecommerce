import React, { useRef, useState } from "react";
import Product from "./Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";


const ProductList = ({ title, products = [], isSwiper = true }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <section className="py-10 px-4 relative">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-5xl font-bold tracking-tight">{title}</h2>

          {/* Swiper nav buttons (shown only if Swiper) */}
          {isSwiper && (
            <div className="flex gap-2">
              <button
                ref={prevRef}
                className={`px-4 py-2 rounded-[8px] text-[20px] transition ${
                  isBeginning
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                }`}
                disabled={isBeginning}
              >
                <FaArrowLeftLong />


              </button>
              <button
                ref={nextRef}
                className={`px-4 py-2 rounded-[8px] text-[20px] transition ${
                  isEnd
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                }`}
                disabled={isEnd}
              >
                <FaArrowRightLong />
              </button>
            </div>
          )}
        </div>
      )}

      {isSwiper ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          modules={[Navigation]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Product product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
