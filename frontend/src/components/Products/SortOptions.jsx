import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    setSearchParams(params);
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="text-[15px] cursor-pointer border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option className="cursor-pointer" value="">Default Sorting</option>
        <option className="cursor-pointer" value="priceAsc">Price: Low to High</option>
        <option className="cursor-pointer" value="priceDesc">Price: High to Low</option>
        <option className="cursor-pointer" value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;