import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "./FilterSidebar";
import SortOptions from "./SortOptions";
import Product from "./Product";
import ProductList from "./ProductListSwiper";

const CollectionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      const fetchedProducts = [
        {
          id: 1,
          gender: "mens",
          name: "Black Shoes",
          sizes: ["S", "M", "L", "XL"],
          colors: ["Blue", "Black", "Gray"],
          price: 180.99,
          comparePrice: 279.99,
          category: "Footwear",
          quantity: 1,
          images: [
            {
              url: "https://picsum.photos/500/500?random=111",
              altText: "Footwear",
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
              url: "https://picsum.photos/500/500?random=11",
              altText: "Leggings",
            },
          ],
        },
        {
          id: 6,
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
              url: "https://picsum.photos/500/500?random=164",
              altText: "Leggings",
            },
          ],
        },
        {
          id: 7,
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
              url: "https://picsum.photos/500/500?random=274",
              altText: "Leggings",
            },
          ],
        },
        {
          id: 8,
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
              url: "https://picsum.photos/500/500?random=24",
              altText: "Leggings",
            },
          ],
        },
      ];
      setProducts(fetchedProducts);
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // add event listener
    document.addEventListener("mousedown", closeSidebar);
    // close event listener
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  return (
    <div className="collection-page p-6 my-6">
      <div className="container max-w-7xl m-auto">
        <div className="flex gap-10">
          {/* mobile filter button  */}
          <button onClick={toggleSidebar} className="block lg:hidden">
            <FaFilter />
          </button>

          <div
            ref={sidebarRef}
            className={`filter-sidebar fixed top-0 left-0 w-64 h-full bg-white p-4 transition-all duration-300 z-99 
            lg:static lg:translate-x-0 lg:w-[20%]
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <FilterSidebar />
          </div>

          <div className="collection-container w-[70%]">
            <div className="flex justify-between items-center w-full">
              <div className="heading mb-10">
                <h4 className="text-4xl font-semibold tracking-tighter">
                  All Collection
                </h4>
              </div>
              <div className="sort-option">
                <SortOptions />
              </div>
            </div>
            <div className="product-grid-main grid grid-cols-4 gap-3 space-y-3.5">
              {products.map((item, index) => {
                return <Product key={item.id} product={item} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
