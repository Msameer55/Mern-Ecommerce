import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Product from "./Product";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const FeaturedProduct = () => {
  const { allProducts: products } = useSelector((state) => state.product);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [buttonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const product = products && products.length > 0 ? products[22] : null;

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  if (!product) return null;

  const handleQtyChnage = (action) => {
    if (action === "plus") {
      setQty((prev) => prev + 1);
    }
    if (action === "minus" && qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if ((product.colors?.length > 0 && !selectedColor) || (product.sizes?.length > 0 && !selectedSize)) {
      toast.error("Please select size and color");
    } else {
      setIsButtonDisabled(true);
      toast.success("Product has been added to cart");

      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 1000);
    }
  };

  const imageChange = (img) => {
    setSelectedImage(img);
  };

  const sellingPrice = product.discountedPrice || product.price;

  return (
    <div className="featured-product-section pt-6 px-4 md:px-8 my-16 bg-gray-50 border-t border-b border-gray-100">
      <div className="">
        <div className="flex justify-between items-end mb-10 border-b pb-4 border-gray-200">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-gray-900">
            Featured Product
          </h2>
        </div>

        <div className="flex justify-center items-start gap-12 flex-col lg:flex-row bg-white p-8 rounded-2xl shadow-sm">
          {/* Image Section */}
          <div className="flex gap-4 flex-col sm:flex-row w-full lg:w-1/2">
            <div className="flex gap-3 flex-row sm:flex-col order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto w-full sm:w-24 flex-shrink-0 scrollbar-hide">
              {product.images?.map((img, index) => (
                <img
                  onClick={() => imageChange(img)}
                  key={index}
                  src={img.url}
                  alt={img.altText || "thumbnail"}
                  className={`flex-shrink-0 w-20 h-24 rounded-lg object-cover cursor-pointer transition-all duration-300
                    ${selectedImage?.url === img.url
                      ? "border-2 border-black opacity-100"
                      : "border border-gray-200 opacity-60 hover:opacity-100"
                    }
                    `}
                />
              ))}
            </div>

            <div className="order-1 sm:order-2 w-full flex-grow h-[400px] sm:h-[500px] overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center">
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText || "featured"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out cursor-pointer"
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 w-full lg:w-1/2 py-4">
            <Link to={`/product/${product._id}`} className="hover:underline decoration-2 underline-offset-4">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">{product.name}</h2>
            </Link>

            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
              <span className="text-3xl font-black text-black">
                Rs. {sellingPrice.toLocaleString()}
              </span>
              {product.discountedPrice && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed max-w-xl">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mt-2">Color</h4>
                <div className="flex gap-3 mt-3">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer w-10 h-10 rounded-full transition-transform hover:scale-110 ${selectedColor === color ? "ring-2 ring-offset-2 ring-black" : "border border-gray-200 shadow-sm"
                        } `}
                      style={{
                        backgroundColor: color.toLocaleLowerCase(),
                      }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mt-4">Size</h4>
                <div className="flex flex-wrap gap-3 mt-3">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`cursor-pointer px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                        ${selectedSize === size
                          ? "bg-black text-white shadow-md scale-105"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quantity">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mt-4 mb-3">Quantity</h4>
              <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-12 max-w-[150px]">
                <button
                  className="cursor-pointer px-5 py-2 text-gray-500 hover:text-black transition-colors rounded-l-full outline-none w-1/3"
                  onClick={() => handleQtyChnage("minus")}
                >
                  -
                </button>
                <span className="w-1/3 text-center font-semibold">{qty}</span>
                <button
                  className="cursor-pointer px-5 py-2 text-gray-500 hover:text-black transition-colors rounded-r-full outline-none w-1/3"
                  onClick={() => handleQtyChnage("plus")}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={buttonDisabled}
              className={`cursor-pointer mt-8 w-full py-4 rounded-full font-bold uppercase tracking-wide text-white transition-all duration-300 shadow-lg
              ${buttonDisabled ? "opacity-50 bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900 hover:-translate-y-1"}`}
            >
              {buttonDisabled ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
