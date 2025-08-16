import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Product = ({ product }) => {
  const saveRs = Math.floor(product.comparePrice - product.price);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize){
      toast.error("Please select size and color")
    }
    else{
      toast.success("Product has been added to your cart")
    }
  }

  return (
    <div className=" bg-white">
      <NavLink to={`product/${product._id}`}>
        <img
          src={product.images[0].url}
          alt={product.images[0].altText}
          className="w-full h-64 object-cover rounded mb-4"
        />
      </NavLink>
      <NavLink to={`/product/${product._id}`}>
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      </NavLink>

      {product.colors && (
        <div className="flex justify-start gap-2 mb-2">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className={`cursor-pointer w-7 h-7 rounded-full border ${selectedColor === color ? "border-2" : "border" }`}
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
                ${selectedSize === size ?  "bg-black text-white"  : "bg-transparent text-gray-600"}
                `}
            >
              {size}
            </span>
          ))}
        </div>
      )}

      <div className="mb-3">
        <span className="text-md font-bold text-black">
          PKR {product.price}
        </span>
        {product.comparePrice && product.comparePrice > product.price && (
          <span className="ml-2 text-sm line-through text-gray-500">
            PKR {product.comparePrice}
          </span>
        )}
        {product.comparePrice && (
          <span className="ml-2 text-gray-600 text-[13px]">
            Save Rs {saveRs}
          </span>
        )}
      </div>

      <button
      onClick={handleAddToCart}
       className="cursor-pointer bg-black text-white w-full py-2  hover:bg-gray-800 transition">
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
