import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-main-container border-t border-gray-300">
      <div className="inner-container container mx-auto   p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5  md:gap-10 items-start">
          <div className=" col newsletter">
            <h3 className="text-[16px] font-semibold ">Newsletter</h3>
            <p className="text-[14px] my-4">
              Be the first to hear about our new products, exclusive events and
              online offers
            </p>
            <p className="text-[14px] font-semibold">
              Sign up and get 10% off your first order
            </p>
            <form className="newsletter-form my-4">
              <div className="flex justify-start items-center">
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="border min-w-[80px] h-[38px] text-[14px] font-normal focus:outline-none outline-none px-3 "
                />
                <button
                  type="submit"
                  className="cursor-pointer px-3 bg-black text-white h-[38px] text-[14px] font-normal leading-[35px]"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <div className=" col main-menus">
            <h3 className="text-[16px] font-semibold mb-5">Shop</h3>
            <ul>
              <li className="text-[14px] font-normal cursor-pointer ">
                Mens Top Wear
              </li>
              <li className="text-[14px] font-normal cursor-pointer ">
                Womens Top Wear
              </li>
              <li className="text-[14px] font-normal cursor-pointer ">
                Mens Bottom Wear
              </li>
              <li className="text-[14px] font-normal cursor-pointer ">
                Womens Bottom Wear
              </li>
            </ul>
          </div>

          <div className=" col quick-links">
            <h3 className="text-[16px] font-semibold mb-5">Support</h3>
            <ul>
              <li className="text-[14px] font-normal cursor-pointer ">
                Contact Us
              </li>
              <li className="text-[14px] font-normal cursor-pointer ">
                About us
              </li>
              <li className="text-[14px] font-normal cursor-pointer ">FAQ's</li>
              <li className="text-[14px] font-normal cursor-pointer ">
                Privacy Policy
              </li>
            </ul>
          </div>

          <div className=" col social-links">
            <h3 className="text-[16px] font-semibold mb-5">Follow Us</h3>
            <div className="flex justify-start gap-3 items-center mb-6">
              <BsTwitterX />
              <FaFacebook />
              <FaInstagram />
            </div>
            <h3 className="text-[15px] font-normal mb-1">Call Us</h3>
            <div className="flex justify0start items-center gap-2">
              <FaPhoneAlt />
              <a href="tel:+123456789">(021) 123456789</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom mt-4">
        <div className="bg-[#2d2d2d] text-white p-3 text-center text-[14px]">
             Copyright &copy; 2025 All right reserved
        </div>
      </div>
    </div>
  );
};

export default Footer;
