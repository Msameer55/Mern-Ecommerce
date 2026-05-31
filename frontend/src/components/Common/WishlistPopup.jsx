import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaTrash, FaArrowRight, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWishListItemsSlice,
  getWishListItemsSlice,
} from "../../redux/slice/wishlistSlice";
import { addToCart } from "../../redux/slice/cartSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ── Detect if a color name is too light to show without a border ──────────────
const isLightColor = (color) => {
  const lightColors = ["white", "ivory", "cream", "beige", "yellow", "lime", "khaki", "snow", "ghost"];
  return lightColors.some((c) => color?.toLowerCase().includes(c));
};

// ── Mini quick-add drawer ─────────────────────────────────────────────────────
const QuickAddDrawer = ({ item, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  // Only use what the product actually has — no fallbacks
  const sizes = Array.isArray(item.sizes) ? item.sizes : [];
  const colors = Array.isArray(item.colors) ? item.colors : [];

  const handleAdd = async () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error("Please select size");
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error("Please select color");
      return;
    }
    setLoading(true);
    await onAddToCart({ item, selectedSize: selectedSize || null, selectedColor: selectedColor || null, qty });
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col justify-end rounded-xl overflow-hidden"
      onClick={onClose}
    >
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Drawer panel */}
      <div
        className="relative bg-white rounded-xl p-3 mx-0.5 mb-0.5"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease" }}
      >
        {/* Sizes */}
        {sizes.length > 0 && (
          <>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Size</p>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-8 h-8 rounded-md text-[11px] font-medium border transition-all cursor-pointer
                    ${selectedSize === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Colors — rendered exactly like ProductDetailPage, using color name as backgroundColor */}
        {colors.length > 0 && (
          <>
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Color</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                  style={{ backgroundColor: color.toLowerCase() }}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform
                    ${selectedColor === color
                      ? "ring-2 ring-offset-1 ring-black scale-110"
                      : "hover:scale-105"
                    }
                    ${isLightColor(color) ? "border border-gray-300" : ""}
                  `}
                />
              ))}
            </div>
          </>
        )}

        {/* Qty + Add */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm cursor-pointer"
            >−</button>
            <span className="w-6 text-center text-xs font-medium text-gray-800">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm cursor-pointer"
            >+</button>
          </div>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="flex-1 bg-gray-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main WishlistPopup ────────────────────────────────────────────────────────
const WishlistPopup = ({ popup, setPopupOpen }) => {
  const popupRef = useRef(null);
  const { user, guestId } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
  }, [guestId, user?._id, dispatch]);

  useEffect(() => {
    document.body.style.overflow = popup ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [popup]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setPopupOpen]);

  const handleDeleteWishlist = async (productId) => {
    try {
      const data = await dispatch(
        deleteWishListItemsSlice({ productId, guestId, userId: user?._id })
      ).unwrap();
      toast.success(data?.message || "Item removed from wishlist");
      dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
    } catch (error) {
      toast.error(error?.message || "Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = async ({ item, selectedSize, selectedColor, qty }) => {
    try {
      await dispatch(
        addToCart({
          userId: user?._id || null,
          guestId: guestId || null,
          productId: item.productId,
          name: item.name,
          price: item.discountedPrice || item.price,
          images: item.images || [item.image],
          quantity: qty,
          size: selectedSize,
          color: selectedColor,
        })
      ).unwrap();
      toast.success("Product has been added to cart");
    } catch (error) {
      toast.error(error || "Failed to add product to cart");
    }
  };

  const handleNavigate = (productId) => {
    navigate(`/product/${productId}`);
    setPopupOpen(false);
  };

  const totalPrice = wishlist.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  if (!popup) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .wishlist-panel { animation: fadeIn 0.2s ease; }
        .wishlist-card-img img { transition: transform 0.35s ease; }
        .wishlist-card:hover .wishlist-card-img img { transform: scale(1.06); }
      `}</style>

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
        <div
          ref={popupRef}
          className="wishlist-panel bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "88vh", fontFamily: "'DM Sans', sans-serif" }}
        >
          {/* ── Header ── */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2
                className="text-[22px] font-semibold text-gray-900 tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Your Wishlist
              </h2>
              <p className="text-[13px] text-gray-400 mt-0.5">
                {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <button
              onClick={() => setPopupOpen(false)}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer mt-0.5"
            >
              <IoMdClose size={15} />
            </button>
          </div>

          {/* ── Grid ── */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {wishlist.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="wishlist-card group relative border border-gray-100 rounded-xl overflow-hidden bg-white hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Image */}
                    <div
                      className="wishlist-card-img relative bg-gray-50 h-36 overflow-hidden cursor-pointer"
                      onClick={() => handleNavigate(item.productId)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Delete — top left */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWishlist(item.productId);
                        }}
                        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 cursor-pointer z-10"
                        aria-label="Remove from wishlist"
                      >
                        <FaTrash className="text-red-400 text-[10px]" />
                      </button>

                      {/* Cart icon — top right */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const hasSizes = item.sizes?.length > 0;
                          const hasColors = item.colors?.length > 0;
                          if (hasSizes || hasColors) {
                            setActiveDrawer(activeDrawer === item.productId ? null : item.productId);
                          } else {
                            handleAddToCart({ item, selectedSize: "", selectedColor: "", qty: 1 });
                          }
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-900 hover:border-gray-900 hover:text-white cursor-pointer z-10 text-gray-500"
                        aria-label="Quick add to cart"
                      >
                        <FaShoppingCart className="text-[10px]" />
                      </button>

                      {/* Quick-add drawer */}
                      {activeDrawer === item.productId && (
                        <QuickAddDrawer
                          item={item}
                          onClose={() => setActiveDrawer(null)}
                          onAddToCart={handleAddToCart}
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => handleNavigate(item.productId)}
                    >
                      <p className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug mb-2">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-gray-900">
                          {Number(item.price).toLocaleString()}
                          <span className="text-[11px] font-normal text-gray-400 ml-1">PKR</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const hasSizes = item.sizes?.length > 0;
                            const hasColors = item.colors?.length > 0;
                            if (hasSizes || hasColors) {
                              setActiveDrawer(activeDrawer === item.productId ? null : item.productId);
                            } else {
                              handleAddToCart({ item, selectedSize: "", selectedColor: "", qty: 1 });
                            }
                          }}
                          className="text-[11px] font-medium text-gray-500 bg-gray-100 hover:bg-gray-900 hover:text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                        >
                          + Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <FaHeart className="text-gray-200 text-5xl" />
                <p
                  className="text-xl font-medium text-gray-700"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Nothing saved yet
                </p>
                <p className="text-sm text-gray-400">Items you wishlist will appear here</p>
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          {wishlist.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
              <span className="text-[13px] text-gray-500">
                Total:{" "}
                <span className="font-semibold text-gray-900">
                  {totalPrice.toLocaleString()} PKR
                </span>
              </span>
              <button
                onClick={() => { navigate("/shop"); setPopupOpen(false); }}
                className="flex items-center gap-2 text-[13px] font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2 transition-colors cursor-pointer"
              >
                Browse more <FaArrowRight className="text-[11px]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPopup;