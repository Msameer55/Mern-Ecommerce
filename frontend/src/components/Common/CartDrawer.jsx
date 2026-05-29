import React, { useEffect, useState, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slice/cartSlice";
import { useLocation } from "react-router-dom";

const CartDrawer = ({ isDrawerOpen, toggleCartDrawer, setIsDrawerOpen }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart, cartItems, loading, error } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const userId = user?._id || null;
  useEffect(() => {
    dispatch(fetchCart({ userId, guestId }))
  }, [dispatch, guestId, user])

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=checkout");
      setIsDrawerOpen(false);
      return;
    }
    else {
      navigate("/checkout");
      setIsDrawerOpen(false);
    }
  };
  const location = useLocation();
  const drawerRef = useRef();
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={drawerRef}
        className={` fixed top-0 right-0 sm:w-1/2 md:w-1/4 h-full bg-white shadow-2xl  transition-transform duration-300 z-999
        ${isDrawerOpen ? " translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4">
          <div className="text">
            <h2 className="font-medium text-2xl  mb-4">Your Cart</h2>
          </div>
        </div>

        <div
          className="absolute top-0 right-0 cursor-pointer p-4"
          onClick={toggleCartDrawer}
        >
          <IoMdClose className="w-6 h-6 text-gray-400" />
        </div>
        {/* Cart Content  */}
        <div className="">
          {
            cartItems.length > 0 ? (
              <>
                <div
                  className="overflow-y-auto p-4"
                  style={{ height: "calc(100vh - 200px)" }}
                >
                  <CartContents user={user} userId={userId} guestId={guestId} cart={cart} cartItems={cartItems} loading={loading} error={error} />
                </div>
                {/* Checkout button */}
                <div className="pb-2 bg-white  fixed bottom-0 text-center top-auto mx-2 right-0 left-0">
                  <button
                    onClick={handleCheckout}
                    className="cursor-pointer rounded-[6px] mb-4 bg-black text-white w-full h-[45px] text-[15px] font-medium"
                  >
                    Checkout
                  </button>
                  <p className="text-md tracking-tighter text-gray-800">
                    Shipping, taxes calculated at checkout{" "}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-20 text-center px-12">
                <h4 className="text-[20px] text-gray-800 text-center mb-3">No items in the cart</h4>
                <p className="text-gray-800 text-center">Cart is empty</p>
                <button
                  onClick={() => navigate("/collections/all")}
                  className="mt-5 cursor-pointer rounded-[6px] mb-4 bg-black text-white w-full h-[45px] text-[15px] font-medium"
                >
                  Shop Now
                </button>
              </div>
            )
          }



        </div>

      </div>
    </>
  );
};

export default CartDrawer;
