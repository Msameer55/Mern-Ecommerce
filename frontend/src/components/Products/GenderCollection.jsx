import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductApi from "../../api/productApi";

const GenderCollection = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Map category slug to database values if needed
        const gender =
          category === "Mens"
            ? "men"
            : category === "Womens"
              ? "women"
              : category;
        const response = await ProductApi.fetchProductsByQuery(
          `gender=${gender}&limit=4`
        );
        // console.log("GenderCollection products:", response.data.products);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching gender collection:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <>
      <div className="gender-collection-section my-15 mb-20">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[400px] bg-gray-200 animate-pulse rounded-lg"
                />
              ))
            ) : products.length > 0 ? (
              products.map((item) => (
                <div className="collection mx-auto mb-5 w-full" key={item._id}>
                  <NavLink to={`/collections/${category.toLowerCase()}`}>
                    {/* overflow-hidden is required for object-cover + scale hover to clip correctly */}
                    <div className="image relative group cursor-pointer overflow-hidden rounded-lg">
                      <img
                        className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0].url
                            : `https://placehold.co/500x400/e2e8f0/94a3b8?text=${encodeURIComponent(item.name)}`
                        }
                        alt={
                          (item.images && item.images[0]?.altText) || item.name
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/500x400/e2e8f0/94a3b8?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                      {/* Product label */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="text-xl font-bold drop-shadow">
                          {item.name}
                        </h4>
                        <p className="text-sm font-medium drop-shadow">
                          Shop Now
                        </p>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
          <div className="buttons-section my-10 flex justify-center w-full text-center">
            <NavLink
              to={`/collections/${category.toLowerCase()}`}
              className="border border-black max-w-[200px] h-[60px] uppercase font-bold px-2 flex items-center hover:bg-black hover:text-white transition-colors duration-300"
            >
              Shop {category}&apos;s Collection
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenderCollection;
