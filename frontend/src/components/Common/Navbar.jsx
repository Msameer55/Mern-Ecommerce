import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import Searchbar from "./Searchbar";
import CartDrawer from "./CartDrawer";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import WishlistPopup from "./WishlistPopup";
import { getWishListItemsSlice } from "../../redux/slice/wishlistSlice";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);
  const { wishlist, error, loading } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWishListItemsSlice({ guestId, userId: user?._id }));
  }, [guestId, user?._id, dispatch]);

  const handleWishlistPopup = () => {
    setPopupOpen(!popupOpen);
  };

  const toggleMenuDrawer = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCartDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <nav>
        <div className="main-nav-container p-3">
          <div className="container mx-auto flex justify-between items-center space-x-4">
            <div className="left-logo">
              <NavLink to="/" className="text-3xl font-extrabold ">
                Rabbit
              </NavLink>
            </div>
            <div
              className={` 
            fixed top-0 left-0 w-full h-full bg-white shadow-2xl
            transition-transform duration-300  z-9999 p-5
            md:relative md:shadow-none md:w-auto md:p-0 md:h-auto
            ${isMenuOpen ? "-translate-x-0 md:translate-none" : "-translate-x-full md:translate-none"}
          `}
            >
              {isMenuOpen && (
                <div className="fixed inset-0 bg-black opacity-5"></div>
              )}

              <div className="nav-links flex flex-col items-left space-x-6 md:justify-between md:items-center  md:flex-row mt-5 md:mt-0">
                <NavLink
                  to="/collections/men"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  All Collections
                </NavLink>
                <NavLink
                  to="/collections/all?gender=men"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  Men
                </NavLink>
                <NavLink
                  to="/collections/all?gender=women"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  Women
                </NavLink>
                <NavLink
                  to="/collections/all?category=Top Wear"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  TopWear
                </NavLink>
                <NavLink
                  to="/collections/all?category=Bottom Wear"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  BottomWear
                </NavLink>
              </div>
              <div
                className="close-icon absolute top-5 right-4 block md:hidden"
                onClick={toggleMenuDrawer}
              >
                <IoMdClose />
              </div>
            </div>

            <div className="right-icons">
              <div className="flex items-center space-x-4">
                {user && user?.role === "admin" && (
                  <button className="bg-black min-w-[70px] h-[33px] cursor-pointer text-white rounded-[8px] text-[14px] leading-[33px] flex justify-center items-center">
                    <NavLink to="/admin">Admin</NavLink>
                  </button>
                )}

                <NavLink to="/profile" className="hover:text-black ">
                  <HiOutlineUser className="h-6 w-6 text-gray-600  cursor-pointer" />
                </NavLink>

                <button
                  className="relative hover:text-black cursor-pointer"
                  onClick={toggleCartDrawer}
                >
                  <HiOutlineShoppingBag className="h-6 w-6 text-gray-600  cursor-pointer" />
                  <span className="absolute -top-1 right-0 bg-[#ea2e0e] text-white rounded-full w-4 h-4 flex justify-center items-center text-[12px]">
                    {cartItems && cartItems.length > 0 ? cartItems.length : 0}
                  </span>
                </button>
                {/* Wishlist Icon  */}
                <button onClick={handleWishlistPopup} className="relative hover:text-black cursor-pointer">
                  <FaRegHeart className="h-5 w-5 text-gray-600  cursor-pointer" />
                  <div className="absolute -top-[10px] -right-[10px] bg-red-500 w-[16px] h-[16px] rounded-full flex items-center justify-center ">
                    <span className="text-white text-[12px] text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </button>
                {popupOpen && (
                  <WishlistPopup
                    popup={popupOpen}
                    setPopupOpen={setPopupOpen}
                  />
                )}
                {/* Search Icon  */}

                <Searchbar />

                {/* Menu Hamburger  */}
                <button
                  className="block md:hidden  cursor-pointer"
                  onClick={toggleMenuDrawer}
                >
                  <HiBars3BottomRight className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CartDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />
    </>
  );
};

export default Navbar;
