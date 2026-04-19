import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Product from "./Product";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct, getSimilarProduct } from "../../redux/slice/productSlice";

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleProduct: productData, similarProduct, loading, error } = useSelector(
    (state) => state.product
  );

  const similarProducts = similarProduct?.similarProducts || [];

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [qty, setQty] = useState(1);
  const [buttonDisabled, setIsButtonDisabled] = useState(false);

  // Fetch single product + similar products whenever the id changes
  useEffect(() => {
    if (id) {
      dispatch(getSingleProduct(id));
      dispatch(getSimilarProduct(id));
    }
  }, [id, dispatch]);

  // Sync selectedImage when productData changes
  useEffect(() => {
    if (productData) {
      setSelectedImage(productData.images?.[0] || null);
      setSelectedColor("");
      setSelectedSize("");
      setQty(1);
    }
  }, [productData]);

  const handleQtyChange = (action) => {
    if (action === "plus") setQty((prev) => prev + 1);
    if (action === "minus" && qty > 1) setQty((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select size and color");
    } else {
      setIsButtonDisabled(true);
      toast.success("Product has been added to cart");
      setTimeout(() => setIsButtonDisabled(false), 1000);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg animate-pulse">Loading product...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Product not found
  if (!productData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="featured-product-section p-6 my-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-center items-start gap-10 flex-col md:flex-row">

          {/* Image Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex gap-3 flex-col">
              {productData.images?.map((img, i) => (
                <img
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  src={img.url}
                  alt={img.altText}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/80x80/e2e8f0/94a3b8?text=Img`;
                  }}
                  className={`w-20 h-20 rounded-md object-cover cursor-pointer border-2 transition-all ${selectedImage?.url === img.url
                    ? "border-black"
                    : "border-transparent"
                    }`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div>
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.altText}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/500x600/e2e8f0/94a3b8?text=${encodeURIComponent(productData.name)}`;
                  }}
                  className="rounded-xl w-full max-w-md object-cover"
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 flex-1">
            <h2 className="text-3xl font-bold">{productData.name}</h2>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold text-black">
                Rs. {productData.discountedPrice || productData.price}
              </span>
              {productData.discountedPrice && (
                <span className="text-gray-400 line-through">
                  Rs. {productData.price}
                </span>
              )}
            </div>

            {/* Description */}
            {productData.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {productData.description}
              </p>
            )}

            {/* Colors */}
            {productData.colors?.length > 0 && (
              <div>
                <h4 className="font-medium mt-4">
                  Color: <span className="font-normal">{selectedColor || "Select"}</span>
                </h4>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {productData.colors.map((color, i) => (
                    <div
                      key={i}
                      title={color}
                      className={`cursor-pointer w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color
                        ? "border-black scale-110"
                        : "border-gray-300"
                        }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {productData.sizes?.length > 0 && (
              <div>
                <h4 className="font-medium mt-4">Size:</h4>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {productData.sizes.map((size, i) => (
                    <span
                      key={i}
                      className={`cursor-pointer px-4 py-2 border text-sm transition-colors ${selectedSize === size
                        ? "bg-black text-white"
                        : "bg-transparent text-black hover:bg-gray-100"
                        }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h4 className="font-medium mt-4">Quantity:</h4>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => handleQtyChange("minus")}
                >
                  -
                </button>
                <span className="px-4 py-2 border min-w-[40px] text-center">{qty}</span>
                <button
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                  onClick={() => handleQtyChange("plus")}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={buttonDisabled}
              className={`mt-6 w-full py-3 text-white transition ${buttonDisabled
                ? "opacity-50 bg-gray-700 cursor-not-allowed"
                : "bg-black hover:bg-gray-800 cursor-pointer"
                }`}
            >
              {buttonDisabled ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {similarProducts.length > 0 && (
        <div className="you-may-like-section mt-10">
          <h2 className="text-3xl my-6 font-bold">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <Product key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
