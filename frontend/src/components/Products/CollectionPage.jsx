import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "./FilterSidebar";
import SortOptions from "./SortOptions";
import Product from "./Product";
import ProductList from "./ProductListSwiper";
import { useDispatch, useSelector } from "react-redux";
import { filterProductsByQuery } from "../../redux/slice/productSlice";
import { useParams } from "react-router-dom";

const CollectionPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { collection } = useParams();
  const { allProducts: products, loading, error } = useSelector((state) => state.product);

  const sidebarRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const collectionMap = {
      men: { gender: "Men" },
      women: { gender: "Women" },
      "top-wear": { category: "Top Wear" },
      "bottom-wear": { category: "Bottom Wear" },
    };

    const queryParams = collectionMap[collection] ||
      (collection && collection !== "all" ? { collections: collection } : {});

    dispatch(filterProductsByQuery(queryParams));
  }, [dispatch, collection]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);
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

          <div className="collection-container w-full lg:w-[80%]">
            <div className="flex justify-between items-center w-full">
              <div className="heading mb-10">
                <h4 className="text-4xl font-semibold tracking-tighter uppercase">
                  {collection.replace("-", " ")} Collection
                </h4>
              </div>
              <div className="sort-option">
                <SortOptions />
              </div>
            </div>

            <div className="product-grid-main">
              {loading ? (
                <p className="text-center text-gray-500">Loading products...</p>
              ) : error ? (
                <p className="text-center text-red-500">Error: {error}</p>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((item) => (
                    <Product key={item._id} product={item} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
