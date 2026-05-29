import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWishListItemsSlice,
  getWishListItemsSlice,
} from "../../redux/slice/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const WishlistPopup = ({ popup, setPopupOpen }) => {
  const popupRef = useRef(null);
  const { user, guestId } = useSelector((state) => state.auth);
  const { wishlist, error, loading } = useSelector((state) => state.wishlist);
  console.log(wishlist, "in popup");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
  }, [guestId, user?._id, dispatch]);

  const handleDeleteWishlist = async (productId) => {
    try {
      const data = await dispatch(
        deleteWishListItemsSlice({
          productId,
          guestId,
          userId: user?._id,
        }),
      ).unwrap();
      console.log("Deleted from wishlist", data);
      setPopupOpen(false);
      toast.success(data?.message || "Item removed from wishlist");
      dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
    } catch (error) {
      toast.error(
        error?.message || error || "Failed to remove item from wishlist",
      );
    }
  };

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [popup]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setPopupOpen]);

  if (!popup) return null;

  const handleNavigate = (productId) => {
    navigate(`/product/${productId}`);
    setPopupOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-9999 p-4 py-12">
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[80vh] overflow-y-auto relative"
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            className="text-gray-600 hover:text-gray-900 transition-colors  cursor-pointer"
            onClick={() => setPopupOpen(false)}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {wishlist.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 text-center">
                  Your Wishlist
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlist.map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer max-w-[340px]"
                    onClick={() => handleNavigate(item.productId)}
                  >
                    {/* Image Wrapper */}
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                      {/* Trash Icon */}
                      <button
                        className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWishlist(item.productId);
                        }}
                      >
                        <FaTrash className="text-red-500 hover:text-red-600 text-sm cursor-pointer" />
                      </button>

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="product-details flex justify-between items-center">
                      <p className="text-[16px] font-medium text-gray-800 line-clamp-2">
                        {item.name}
                      </p>

                      <p className="text-md font-medium text-gray-500">
                        {item.price} RS
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg text-gray-500">Your wishlist is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPopup;
