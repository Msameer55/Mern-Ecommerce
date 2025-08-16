import React from "react";
import { NavLink } from "react-router-dom";
import MyOrder from "./MyOrder";

const Profile = () => {
  return (
    <div className="profile-main-container my-10">
      <div className="inner-container container mx-auto max-w-6xl">
        <div className="flex justify-between items-start">
          <div className="w-[30%]">
            <div className="admin-details p-5 shadow-md flex flex-col space-y-3 items-center">
              <h2 className="font-bold text-2xl">Admin User</h2>
              <p className="font-normal text-lg">admin@example.com</p>
              <button className="w-full bg-black h-[40px] text-white text-md">
                <NavLink> Logout</NavLink>
              </button>
            </div>
          </div>
          <div className="w-[65%]">
            <MyOrder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
