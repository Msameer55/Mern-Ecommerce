import React, { useState } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSearchBar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search term: ",  searchTerm);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`flex justify-center items-center w-full transition-all duration-300 
        ${isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-9999 " : "w-auto"}
        `}
      >
        {isOpen ? (
          <>
            <form
              onSubmit={handleSearchSubmit}
              className="flex justify-center items-center w-full relative"
            >
              <div className="relative w-1/2">
                <input
                  type="text"
                  className="border-lg bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
                  placeholder="Search ...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="cursor-pointer search-icon absolute right-3 top-0 bottom-0 h-full flex justify-center items-center">
                  <IoIosSearch className="h-6 w-6 text-gray-600" />
                </button>
              </div>
              <div
                className="bg-[#dddddd] cursor-pointer close-icon absolute top-0 right-10 bottom-auto flex justify-center items-center rounded-full w-[40px] h-[40px]"
                onClick={handleToggleSearchBar}
              >
                <IoMdClose className="w-6 h-6 text-gray-400" />
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
