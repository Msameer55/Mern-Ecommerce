import React, { useRef, useEffect, useState } from "react";
import Product from "./Product";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import ProductList from "./ProductListSwiper";


const NewArrivals = () => {

  const newArrival = [
    {
      id: 1,
      gender: "mens",
      name: "Casual Denim Jacket",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black", "Gray"],
      price: 59.99,
      comparePrice: 79.99,
      category: "Outerwear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=111",
          altText: "Denim Jacket",
        },
      ],
    },
    {
      id: 2,
      gender: "womens",
      name: "Silk Floral Dress",
      sizes: ["XS", "S", "M"],
      colors: ["Pink", "White", "yellow"],
      price: 79.99,
      comparePrice: 99.99,
      category: "Dresses",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=112",
          altText: "Silk Floral Dress",
        },
      ],
    },
    {
      id: 3,
      gender: "mens",
      name: "Graphic T-Shirt",
      sizes: ["M", "L", "XL"],
      colors: ["Black", "White", "Red"],
      price: 29.99,
      comparePrice: 39.99,
      category: "Top Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=113",
          altText: "Graphic T-Shirt",
        },
      ],
    },
    {
      id: 4,
      gender: "womens",
      name: "High Waist Leggings",
      sizes: ["S", "M", "L"],
      colors: ["Gray", "Black", "Purple"],
      price: 35.99,
      comparePrice: 49.99,
      category: "Bottom Wear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=114",
          altText: "Leggings",
        },
      ],
    },
    {
      id: 5,
      gender: "mens",
      name: "Athletic Hoodie",
      sizes: ["M", "L", "XL"],
      colors: ["Red", "Navy", "Charcoal"],
      price: 45.99,
      comparePrice: 59.99,
      category: "Activewear",
      quantity: 1,
      images: [
        {
          url: "https://picsum.photos/500/500?random=115",
          altText: "Athletic Hoodie",
        },
      ],
    },
  ];

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
