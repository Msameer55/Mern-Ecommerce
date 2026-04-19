import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Product = ({ product }) => {
  const displayPrice = product.discountedPrice || product.price;
  const originalPrice = product.discountedPrice ? product.price : null;
  const saveRs = originalPrice ? Math.floor(originalPrice - displayPrice) : 0;
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color");
    } else {
      toast.success("Product has been added to your cart");
    }
  };

  return (
    <div className=" bg-white">
      <div className="product-image h-[300px] w-full overflow-hidden rounded">
        <NavLink to={`/product/${product._id}`}>
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300/e2e8f0/94a3b8?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </NavLink>
      </div>
      <NavLink to={`/product/${product._id}`}>
        <h3 className="my-3 font-semibold leading-[19px] text-[16px] mb-1">{product.name}</h3>
      </NavLink>

      {product.colors && (
        <div className="flex justify-start gap-2 my-2">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className={`cursor-pointer w-7 h-7 rounded-full border ${selectedColor === color ? "border-2" : "border"}`}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {product.sizes && (
        <div className="flex justify-start gap-2 text-sm mb-2">
          {product.sizes.map((size, index) => (
            <span
              key={index}
              onClick={() => setSelectedSize(size)}
              className={`cursor-pointer border w-8 h-8 rounded-sm  flex justify-center items-center
                ${selectedSize === size ? "bg-black text-white" : "bg-transparent text-gray-600"}
                `}
            >
              {size}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3">
        <span className="text-md font-bold text-black">
          PKR {displayPrice}
        </span>
        {originalPrice && (
          <span className="ml-2 text-sm line-through text-gray-500">
            PKR {originalPrice}
          </span>
        )}
        {saveRs > 0 && (
          <span className="ml-2 text-gray-600 text-[13px]">
            Save Rs {saveRs}
          </span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="cursor-pointer bg-black text-white w-full py-2  hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
