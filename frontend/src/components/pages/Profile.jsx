import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import MyOrder from "./MyOrder";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useState } from "react";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [logoutDelete, setLogoutDelete] = useState(false);
  const logoutRef = useRef();

  const handleLogout = () => {
    dispatch(logout());
    setLogoutDelete(false)
    toast.success("Logout successfully");
  }

  return (
    <>
      <div className="profile-main-container my-10">
        <div className="inner-container my-16 mb-24 px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="w-full mb-10 md:w-[20%]">
              <div className="admin-details p-5 shadow-md flex flex-col space-y-3 items-center">
                <h2 className="font-bold text-2xl">{user.name}</h2>
                <p className="font-normal text-lg overflow-hidden">{user.email}</p>
                <button className="w-full bg-red-500 hover:bg-red-600 transition-all rounded-[4px] cursor-pointer h-[40px] text-white text-md">
                  <NavLink className="w-full h-full flex justify-center items-center" onClick={() => setLogoutDelete(true)}> Logout</NavLink>
                </button>
              </div>
            </div>
            <div className="w-full md:w-[78%] min-w-0">
              <MyOrder />
            </div>
          </div>
        </div>
      </div>

      {logoutDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999999" onClick={() => setLogoutDelete(false)}>
          <div
            ref={logoutRef}
            className="bg-white rounded-xl p-6 w-80 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="">
              <h2 className="text-lg font-semibold mb-2">Delete User?</h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to delete this user?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutDelete(false)}
                  className=" cursor-pointer flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className=" cursor-pointer flex-1 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>

  );
};

export default Profile;
