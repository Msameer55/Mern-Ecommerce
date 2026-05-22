import React, { useState } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import {
  filterProductsByQuery,
  setFilters,
} from "../../redux/slice/productSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleToggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = await dispatch(
        filterProductsByQuery({ search: searchTerm, collections: "all" }),
      ).unwrap();
      toast.success(data.message);
      navigate(`/collections/all?search=${searchTerm}`);
      setIsOpen(false);
      setSearchTerm("");
    } catch (error) {
      toast.error(error || error?.message);
    }
  };

  return (
    <>
      <div
        className={` w-full transition-all duration-300 flex 
        ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-9999 " : "w-auto"}
        `}
      >
        {isOpen ? (
          <>
            <form
              onSubmit={handleSearchSubmit}
              className="flex justify-center items-center w-full relative h-full"
            >
              <div className="relative sm:w-full md:w-1/2">
                <input
                  type="text"
                  className="border-lg bg-gray-100 px-4 py-3 pl-4 pr-12 rounded-[40px] focus:outline-none w-full placeholder:text-gray-700"
                  placeholder="Search ...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="cursor-pointer search-icon absolute right-3 top-0 bottom-0 h-full flex justify-center items-center">
                  <IoIosSearch className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <div
                className=" cursor-pointer close-icon absolute top-0 right-10 bottom-0 h-full  flex justify-center items-center"
                onClick={handleToggleSearchBar}
              >
                <div className="bg-[#dddddd] w-[30px] h-[30px] md:w-[40px] md:h-[40px]  rounded-full flex justify-center items-center">
                  <IoMdClose className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
                </div>
              </div>
            </form>
          </>
        ) : (
          <button
            className="search-icon cursor-pointer"
            onClick={handleToggleSearchBar}
          >
            <IoIosSearch className="h-6 w-6 text-gray-600" />
          </button>
        )}
      </div>
    </>
  );
};

export default Searchbar;
