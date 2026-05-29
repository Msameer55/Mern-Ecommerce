import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../config/axios";

const FilterSidebar = () => {
  const navigate = useNavigate();

  const resetFilters = () => {

    const resetValues = {
      category: "",
      gender: "",
      color: "",
      size: [],
      brand: [],
      material: [],
      minPrice: 0,
      maxPrice: 100,
    };

    setFilters(resetValues);
    setPriceRange([0, 100]);

    setSearchParams({});
    navigate(window.location.pathname);
  }

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    brand: [],
    material: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    genders: [],
    colors: [],
    sizes: [],
    materials: [],
    brands: [],
  });

  const [priceRange, setPriceRange] = useState([0, 100000]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await axiosInstance.get("/api/products/meta/filters");
        if (response.data.success) {
          setFilterOptions(response.data.filters);
        }
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // Convert Search Params into plain object
  useEffect(() => {
    // Object.fromEntries gives key value pair of array [[name, Sameer], [age, 12]] => {name : "Sameer", age: 12}
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 100,
    });
    setPriceRange([0, params.maxPrice || 100]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item != value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    console.log(newFilters);
    updateURLSearchParams(newFilters);
  };

  const updateURLSearchParams = (newFilters) => {
    const params = new URLSearchParams(searchParams); // ✅ start from existing params

    Object.keys(newFilters).forEach((item) => {
      if (Array.isArray(newFilters[item]) && newFilters[item].length > 0) {
        params.set(item, newFilters[item].join(",")); // ✅ overwrite if exists
      } else if (newFilters[item]) {
        params.set(item, newFilters[item]);
      } else {
        params.delete(item);
      }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`); // ✅ correct
  };

  return (
    <div className="filter-sidebar-main-container">
      <div className="">
        <div className="flex justify-between items-center  mb-4">
          <h4 className="font-semibold text-gray-700">Filters</h4>
          <button onClick={resetFilters} className="font-semibold text-xs text-gray-700 underline cursor-pointer">Reset Filters</button>
        </div>


        {/* Category Filter  */}
        <div className="mb-6">
          <label className="block  text-gray-700 font-medium mb-2">
            Categories
          </label>
          {filterOptions.categories.map((category) => {
            return (
              <div key={category} className="flex items-center mb-1">
                <input
                  type="radio"
                  name="category"
                  id="category"
                  value={category}
                  onChange={handleFilterChange}
                  checked={filters.category === category}
                  className="mr-2 h-4 w-4 text-blue-500 cursor-pointer
              focus:ring-blue-400 border-gray-300"
                />
                <span>{category}</span>
              </div>
            );
          })}
        </div>

        {/* Gender Filter  */}
        <div className="mb-6">
          <label className="block  text-gray-700 font-medium mb-2">
            Gender
          </label>
          {filterOptions.genders.map((gender) => {
            return (
              <div key={gender} className="flex items-center mb-1">
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value={gender}
                  onChange={handleFilterChange}
                  className="mr-2 h-4 w-4 text-blue-500 cursor-pointer
              focus:ring-blue-400 border-gray-300"
                  checked={filters.gender === gender}
                />
                <span>{gender}</span>
              </div>
            );
          })}
        </div>

        {/* Color Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.colors.map((color) => (
            <button
              key={color}
              type="buttons"
              name="color"
              className={`cursor-pointer mr-2 w-8 h-8 rounded-full ${filters.color === color
                ? "ring-2 ring-offset-2"
                : "border border-gray-300"
                }`}
              value={color}
              onClick={handleFilterChange}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Sizes</label>
          {filterOptions.sizes.map((size) => (
            <div key={size} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="size"
                className="mr-2"
                value={size}
                onChange={handleFilterChange}
                checked={filters.size.includes(size)}
              />
              <span>{size}</span>
            </div>
          ))}
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Brand</label>
          {filterOptions.brands.map((brand) => (
            <div key={brand} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="brand"
                className="mr-2"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
              />
              <span>{brand}</span>
            </div>
          ))}
        </div>

        {/* Material Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Material
          </label>
          {filterOptions.materials.map((material) => (
            <div key={material} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="material"
                className="mr-2"
                value={material}
                onChange={handleFilterChange}
                checked={filters.material.includes(material)}
              />
              <span>{material}</span>
            </div>
          ))}
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Price Range
          </label>
          <div className="flex flex-col space-y-2">
            <input
              type="range"
              name="maxPrice"
              min={0}
              max={100}
              value={filters.maxPrice || 100}
              onChange={handleFilterChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-500">0 - {filters.maxPrice || 100}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
