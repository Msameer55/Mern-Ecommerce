import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "./FilterSidebar";
import SortOptions from "./SortOptions";
import Product from "./Product";
import ProductList from "./ProductListSwiper";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { filterProductsByQuery } from "../../redux/slice/productSlice";
import { toast } from "react-toastify";

const CollectionPage = () => {
  const { collection } = useParams();
  const { allProducts: products, loading, error } = useSelector((state) => state.product);
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const queryParams = Object.fromEntries(searchParams);

  let filterNames = "All";
  if (collection === "all") {
    if (queryParams.gender) {
      filterNames = queryParams.gender;
    } else if (queryParams.category) {
      filterNames = queryParams.category;
    }
  } else if (collection) {
    filterNames = collection.replace("-", " ").split(" ").map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(filterProductsByQuery({ collections: collection, ...queryParams }));
    // console.log(queryParams, "queryparams ", collection)
  }, [collection, dispatch, searchParams.toString()])

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
    <div className="collection-page p-4 md:p-6 my-6">
      <div className="container max-w-9xl m-auto">
        <div className="flex gap-10 flex-col md:flex-row">
          <div className="flex justify-between items-center md:hidden w-full">
            {/* mobile filter button  */}
            <button onClick={toggleSidebar} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <FaFilter /> <span>Filter</span>
            </button>
            <div className="sort-option">
              <SortOptions />
            </div>
          </div>

          <div
            ref={sidebarRef}
            className={`filter-sidebar fixed top-0 left-0 w-64 h-full bg-white p-4 transition-all duration-300 z-99 
            lg:static lg:translate-x-0 lg:w-[20%]
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <FilterSidebar />
          </div>

          <div className="collection-container md:w-[70%]">
            <div className="flex justify-between items-center w-full">
              <div className="heading mb-10">
                <h4 className="text-4xl font-semibold tracking-tighter">
                  {filterNames} Collection
                </h4>
              </div>
              <div className="sort-option lg:block hidden">
                <SortOptions />
              </div>
            </div>
            <div className="product-grid-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products?.length > 0 ? (
                products.map((item) => (
                  <Product key={item._id} product={item} loading={loading} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <p className="text-xl font-medium">No products found</p>
                  <p className="mt-2 text-sm">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
