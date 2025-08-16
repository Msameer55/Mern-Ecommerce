import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import Searchbar from "./Searchbar";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <NavLink to="/" className="text-3xl font-medium ">
                Rabbit
              </NavLink>
            </div>
            <div
              className={` 
            fixed top-0 left-0 w-full h-full bg-white shadow-2xl
            transition-transform duration-300  z-9999 p-5
            md:relative md:shadow-none md:w-auto md:p-0 md:h-auto
            ${isMenuOpen ? '-translate-x-0 md:translate-none' : '-translate-x-full md:translate-none' }
          `}
            >
              {isMenuOpen && (
                <div className="fixed inset-0 bg-black opacity-5"></div>
              )}

              <div className="nav-links flex flex-col items-left space-x-6 md:justify-between md:items-center  md:flex-row mt-5 md:mt-0">
                <NavLink
                  to="/collections/all"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  Mens
                </NavLink>
                <NavLink
                  to="/women"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  Womens
                </NavLink>
                <NavLink
                  to="/top-wear"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  TopWear
                </NavLink>
                <NavLink
                  to="/bottom-wear"
                  className="text-gray-700 hover:text-black text-[14px] uppercase p-3 md:p-0"
                >
                  BottomWear
                </NavLink>
              </div>
              <div className="close-icon absolute top-5 right-4 block md:hidden" onClick={toggleMenuDrawer}>
                <IoMdClose />
              </div>
            </div>

            <div className="right-icons">
              <div className="flex items-center space-x-4">
                <NavLink to="/profile" className="hover:text-black ">
                  <HiOutlineUser className="h-6 w-6 text-gray-600  cursor-pointer" />
                </NavLink>

                <button
                  className="relative hover:text-black cursor-pointer"
                  onClick={toggleCartDrawer}
                >
                  <HiOutlineShoppingBag className="h-6 w-6 text-gray-600  cursor-pointer" />
                  <span className="absolute -top-1 right-0 bg-[#ea2e0e] text-white rounded-full w-4 h-4 flex justify-center items-center text-[12px]">
                    4
                  </span>
                </button>

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
        toggleCartDrawer={toggleCartDrawer}
      />
    </>
  );
};

export default Navbar;
