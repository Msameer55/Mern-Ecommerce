import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";

const CartDrawer = ({ isDrawerOpen, toggleCartDrawer }) => {
  return (
    <>
      <div
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
        <div
          className="flex-grow overflow-y-scroll p-4"
          style={{ height: "calc(100% - 150px)" }}
        >
          <CartContents />
        </div>
        {/* Checkout button */}
        <div className="pb-2 bg-white  fixed bottom-0 text-center top-auto mx-2 right-0 left-0">
          <button className="cursor-pointer rounded-[6px] mb-4 bg-black text-white w-full h-[45px] text-[15px] font-medium">
            Checkout
          </button>
          <p className="text-md tracking-tighter text-gray-800">
            Shipping, taxes calculated at checkout{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
