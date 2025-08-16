import React from "react";
import Topbar from "./Topbar";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";

const Header = () => {
  return (
    <>
      <header className=" border-b border-gray-300">
        {/* Top Bar  */}
        <Topbar />
        {/* Navbar  */}
        <Navbar />
        {/* Cart Drawer  */}
     
      </header>
    </>
  );
};

export default Header;
