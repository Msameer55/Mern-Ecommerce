import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";

const GenderCollection = ({ category }) => {
  const { allProducts: products } = useSelector((state) => state.product);

  const filteredProducts = products
    .filter((item) =>
      item.gender?.toLowerCase() === category.toLowerCase() ||
      item.category?.toLowerCase() === category.toLowerCase()
    )
    .slice(0, 4);

  return (
    <div className="gender-collection-section my-16 mb-24 px-4 md:px-8">
      {filteredProducts.length > 0 && (
        <>
          <div className="flex justify-between items-end mb-8 border-b pb-4 border-gray-200">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-gray-900">
              {category}'s Collection
            </h2>
            <NavLink
              to={`collections/all?gender=${category}`}
              className="text-sm font-semibold uppercase tracking-widest text-gray-500 hover:text-black transition-colors duration-300 hidden md:block"
            >
              View All
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((item) => {
              const sellingPrice = item.discountedPrice || item.price;
              const isDiscounted = item.discountedPrice && item.discountedPrice < item.price;

              return (
                <div className="group flex flex-col relative" key={item._id}>
                  {/* Image Container */}
                  <Link to={`/product/${item._id}`} className="block relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-md bg-gray-100 mb-4 transition-all duration-500 shadow-sm hover:shadow-xl">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                      src={item.images?.[0]?.url || "https://picsum.photos/500/500"}
                      alt={item.images?.[0]?.altText || item.name}
                    />

                    {/* Hover Overlay */}

                    {/* Sale Badge */}
                    {isDiscounted && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase rounded-sm z-10 shadow-md">
                        Sale
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <Link to={`/product/${item._id}`} className="block break-words pr-4 hover:underline decoration-1 underline-offset-4 cursor-pointer">
                        <h3 className="text-base font-medium text-gray-900 leading-tight">{item.name}</h3>
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 mt-auto pt-2">
                      <span className="text-base font-semibold text-gray-900">
                        PKR {sellingPrice.toLocaleString()}
                      </span>
                      {isDiscounted && (
                        <span className="text-sm line-through text-gray-400">
                          PKR {item.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-12 flex justify-center w-full md:hidden">
            <NavLink
              to={`collections/${category}`}
              className="w-full sm:w-auto border border-black bg-black text-white text-center py-3 px-8 uppercase font-semibold text-sm hover:bg-white hover:text-black transition-colors duration-300 rounded-sm shadow-md"
            >
              Shop All {category}
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default GenderCollection;
