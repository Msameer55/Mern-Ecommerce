import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Product from "./Product";
import { useParams } from "react-router-dom";
import { fakeData } from "../fakeData/ProductData";
import {
fetchSimilarProductById,
  fetchSingleProduct,
  getSimilarProduct,
  getSingleProduct,
} from "../../redux/slice/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactSpinner from "../ReactSpinner";
import { addToCart } from "../../redux/slice/cartSlice";
import StarRating from "../Common/StarRating";
import { FaHeart, FaHeartBroken, FaRegHeart } from "react-icons/fa";
import TooltipIcon from "../Common/Tooltip";
import {
  addWishListItemsSlice,
  deleteWishListItemsSlice,
  getWishListItemsSlice,
} from "../../redux/slice/wishlistSlice";

const ProductDetailPage = () => {
  const { id } = useParams();
  const {
    singleProduct: productData,
    loading,
    similarProduct,
  } = useSelector((state) => state.product);
  const { user, guestId } = useSelector((state) => state.auth);
  const { wishlist, error } = useSelector((state) => state.wishlist);
  const [productInWishlist, setProductInWishlist] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [buttonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  // Fetch Single Product
  useEffect(() => {
    const getProductWithId = async () => {
      try {
        const data = await dispatch(fetchSingleProduct(id)).unwrap();
        // toast.success(data || "Product fetched successfully");
      } catch (error) {
        toast.error(error || "Failed to fetch product");
      }
    };
    getProductWithId();
  }, [id]);

  // Fetch Similar Product
  useEffect(() => {
    const getSimilarProduct = async () => {
      try {
        const data = await dispatch(fetchSimilarProductById(id)).unwrap();
        toast.success(data || "Similar product fetched successfully");
      } catch (error) {
        toast.error(error || "Failed to fetch similar product");
      }
    };
    getSimilarProduct();
  }, [id]);

  useEffect(() => {
    dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
  }, [guestId, user?._id, dispatch]);

  // Keep local `productInWishlist` in sync with global wishlist
  useEffect(() => {
    if (!productData || !productData._id) return;
    if (Array.isArray(wishlist)) {
      const exists = wishlist.some(
        (item) => item.productId?.toString() === productData._id,
      );
      setProductInWishlist(exists ? productData._id : null);
    }
  }, [wishlist, productData]);

  const productToAdd = async (productId) => {
    try {
      const data = await dispatch(
        addWishListItemsSlice({ productId, guestId, userId: user?._id }),
      ).unwrap();
      // refresh wishlist in state
      await dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
      toast.success(data?.message || "Product added to wishlist");
      setProductInWishlist(productId);
    } catch (error) {
      toast.error(error.message || "Failed to add product to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const data = await dispatch(
        deleteWishListItemsSlice({ productId, guestId, userId: user?._id }),
      ).unwrap();
      // refresh wishlist in state
      await dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
      toast.success(data?.message || "Product removed from wishlist");
      setProductInWishlist(null);
    } catch (error) {
      toast.error(error.message || "Failed to remove product from wishlist");
    }
  };

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

  const handleAddToCart = async () => {
    try {
      if (!selectedColor || !selectedSize) {
        toast.error("Please select size and color");
      } else {
        await dispatch(
          addToCart({
            userId: user?._id || null,
            guestId: guestId || null,
            productId: productData._id,
            name: productData.name,
            price: productData.discountedPrice || productData.price,
            images: productData.images,
            quantity: qty,
            size: selectedSize,
            color: selectedColor,
          }),
        ).unwrap();
        setIsButtonDisabled(true);
        toast.success("Product has been added to cart");
      }
    } catch (error) {
      toast.error(error || "Failed to add product to cart");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const isLightColor = (color) => {
    const lightColors = [
      "white",
      "ivory",
      "cream",
      "beige",
      "yellow",
      "lime",
      "khaki",
    ];
    return lightColors.some((c) => color.toLowerCase().includes(c));
  };

  useEffect(() => {
    if (productData && productData.images && productData.images.length > 0) {
      setSelectedImage(productData.images[0]);
    }
  }, [productData]);

  if (loading || !productData || !productData._id || !selectedImage) {
    return (
      <div className="p-6 text-center text-xl mt-10">
        <ReactSpinner />
      </div>
    );
  }

  const sellingPrice = productData.discountedPrice || productData.price;
  const isDiscounted =
    productData.discountedPrice &&
    productData.discountedPrice < productData.price;

  return (
    <div className="featured-product-section p-4 md:p-8 my-6">
      {loading ? (
        <ReactSpinner />
      ) : (
        <>
          <div className="container mx-auto max-w-8xl bg-white md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-4">
                {/* Thumbnails (Only show if more than 1 image) */}
                {productData.images.length > 1 && (
                  <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto h-[100px] sm:h-[500px] w-full sm:w-24 flex-shrink-0 scrollbar-hide">
                    {productData.images.map((img, i) => (
                      <div
                        key={i}
                        className={`flex-shrink-0 w-20 h-24 sm:w-full sm:h-28 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${selectedImage.url === img.url ? "border-black shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img.url}
                          alt={img.altText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="order-1 sm:order-2 w-full h-[400px] sm:h-[500px] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.altText}
                    className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700 ease-in-out cursor-zoom-in"
                  />
                </div>
              </div>

              {/* Details Section */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                {/* Badges/Category */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <StarRating rating={productData.rating} />
                  <span className="rating text-green-500 text-sm font-semibold uppercase ">
                    {productData.rating || 0}/5
                  </span>
                  <span className="bg-gray-100 text-gray-800 tracking-wider text-xs font-bold uppercase rounded-full py-1.5 px-4">
                    {productData.category}
                  </span>
                  {isDiscounted && (
                    <span className="bg-red-50 text-red-600 tracking-wider text-xs font-bold uppercase rounded-full py-1.5 px-4 font-mono">
                      Sale!
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
                  {productData.name}
                </h2>

                <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-4xl font-black text-black">
                    Rs. {sellingPrice}
                  </span>
                  {isDiscounted && (
                    <div className="flex flex-col">
                      <span className="text-lg text-gray-400 line-through font-medium leading-none">
                        Rs. {productData.price}
                      </span>
                      <span className="text-green-600 text-sm font-bold mt-1">
                        Save Rs. {(productData.price - sellingPrice).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="product-description mb-8">
                  <p className="text-gray-500 text-md leading-relaxed">
                    {productData.description}
                  </p>
                </div>

                {/* Colors */}
                {productData.colors && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900 mb-3 block">
                      Color
                    </h4>
                    <div className="flex gap-3">
                      {productData.colors.map((color, i) => (
                        <div
                          key={i}
                          className={`group relative cursor-pointer w-10 h-10 rounded-full hover:scale-110 transition-transform duration-200 flex items-center justify-center ${selectedColor === color ? "ring-2 ring-offset-2 ring-black" : "border border-gray-200 shadow-sm"}`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          onClick={() => setSelectedColor(color)}
                        >
                          {/* Tooltip */}
                          <div
                            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 
                px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl
                opacity-0 -translate-y-1 z-10
                group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-200 ease-out"
                            style={{
                              backgroundColor: "#111",
                              color: "#fff",
                            }}
                          >
                            {color}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {productData.sizes && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-900">
                        Size
                      </h4>
                      {productData.sizeGuide && (
                        <span className="text-xs text-gray-500 underline cursor-pointer hover:text-black">
                          Size Guide
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {productData.sizes.map((size, i) => (
                        <button
                          key={i}
                          className={`cursor-pointer min-w-[3rem] px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 outline-none
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

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  {/* Quantity */}
                  <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 h-14 w-full sm:w-auto">
                    <button
                      className="cursor-pointer px-5 py-2 text-gray-500 hover:text-black transition-colors rounded-l-full outline-none"
                      onClick={() => handleQtyChange("minus")}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        ></path>
                      </svg>
                    </button>
                    <span className="w-10 text-center font-semibold text-lg">
                      {qty}
                    </span>
                    <button
                      className="cursor-pointer px-5 py-2 text-gray-500 hover:text-black transition-colors rounded-r-full outline-none"
                      onClick={() => handleQtyChange("plus")}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                    </button>
                  </div>

                  {/* Add to cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={buttonDisabled}
                    className={`cursor-pointer w-full sm:flex-1 h-14 rounded-full font-bold text-lg tracking-wide text-white transition-all duration-300 flex items-center justify-center gap-2 ${buttonDisabled
                        ? "opacity-50 bg-gray-400 cursor-not-allowed"
                        : "bg-black hover:bg-gray-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      }`}
                  >
                    {buttonDisabled ? (
                      "Adding..."
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          ></path>
                        </svg>
                        Add to Cart
                      </>
                    )}
                  </button>

                  <div className="wishlist-btn-container">
                    <TooltipIcon text="Add to Wishlist">
                      {productInWishlist === productData._id ? (
                        <FaHeart
                          className="text-2xl cursor-pointer text-red-500"
                          onClick={() => removeFromWishlist(productData._id)}
                        />
                      ) : (
                        <FaRegHeart
                          className="text-2xl cursor-pointer"
                          onClick={() => productToAdd(productData._id)}
                        />
                      )}
                    </TooltipIcon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="you-may-like-section mt-16 max-w-8xl mx-auto px-4 md:px-0">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.isArray(similarProduct) &&
                similarProduct.map((p) => <Product key={p._id} product={p} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailPage;
