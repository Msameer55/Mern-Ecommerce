import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import ReactSpinner from "../ReactSpinner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slice/cartSlice";

const Product = ({ product }) => {
  // Use discountedPrice if available as the actual selling price, else regular price.
  const sellingPrice = product.discountedPrice || product.price;
  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;
  const saveRs = isDiscounted ? Math.floor(product.price - product.discountedPrice) : 0;
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { guestId, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      if (!selectedColor || !selectedSize) {
        toast.error("Please select size and color");
      } else {
        await dispatch(addToCart({ productId: product._id, color: selectedColor, size: selectedSize, quantity: 1, guestId, userId: user?._id || null }));
        toast.success("Product has been added to your cart");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="min-h-[380px] h-[400px] overflow-hidden mb-4">
        <NavLink to={`/product/${product._id}`}>
          <img
            src={product.images?.[0]?.url || "https://picsum.photos/500/500"}
            alt={product.images?.[0]?.altText || product.name}
            className="w-full h-full object-cover rounded"
          />
        </NavLink>
      </div>

      <NavLink to={`/product/${product._id}`}>
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
      </NavLink>

      {product.colors && (
        <div className="flex justify-start gap-2 my-2">
          {product.colors.map((color, index) => (
            <span
              key={index}
              className={`cursor-pointer w-7 h-7 rounded-full ${selectedColor === color ? "border-3 border-black" : "border border-gray-300"}`}
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
          PKR {sellingPrice}
        </span>
        {isDiscounted && (
          <span className="ml-2 text-sm line-through text-gray-500">
            PKR {product.price}
          </span>
        )}
        {isDiscounted && (
          <span className="ml-2 text-gray-600 text-[13px]">
            Save Rs {saveRs}
          </span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`  cursor-pointer bg-black text-white w-full py-2  hover:bg-gray-800 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? <ReactSpinner /> : "Add to Cart"}
      </button>
    </div>
  );
};

export default Product;
