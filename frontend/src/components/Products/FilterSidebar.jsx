import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    sizes: [],
    brand: [],
    material: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Mens", "Womens"];
  const colors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Purple",
    "Orange",
    "Yellow",
    "Pink",
  ];
  const [priceRange, setPriceRange] = useState([0, 100]);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = [
    "Cotton",
    "Fabric",
    "Linean",
    "Silk",
    "Polyster",
    "Wool",
    "Denin",
    "Fleece",
  ];

  const brands = [
    "Nike",
    "Adidas",
    "Puma",
    "Levis",
    "Zara",
    "Gucci",
    "H&M",
    "Under Armour",
  ];

  // Convert Search Params into plain object
  useEffect(() => {
    // Object.fromEntries gives key value pair of array of array [[name, Sameer], [age, 12]] => {name : "Sameer", age: 12}
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      sizes: params.sizes ? params.sizes.split(",") : [],
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
        <h4 className="font-semibold text-gray-700 mb-4">Filters</h4>

        {/* Category Filter  */}
        <div className="mb-6">
          <label className="block  text-gray-700 font-medium mb-2">
            Categories
          </label>
          {categories.map((category) => {
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
          {genders.map((gender) => {
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
          {colors.map((color) => (
            <button
              key={color}
              type="buttons"
              name="color"
              className={`mr-2 w-8 h-8 rounded-full ${
                filters.color === color
                  ? "border-2 border-black"
                  : "border border-gray-300"
              }`}
              value={color}
              onClick={handleFilterChange}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>

        {/* Size Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Sizes</label>
          {sizes.map((size) => (
            <div key={size} className="flex items-center mb-1">
              <input
                type="checkbox"
                name="size"
                className="mr-2"
                value={size}
                onChange={handleFilterChange}
                checked={filters.sizes.includes(size)}
              />
              <span>{size}</span>
            </div>
          ))}
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Brand</label>
          {brands.map((brand) => (
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
          {materials.map((material) => (
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
            <input type="range" min="0" max="100" />
            <span className="text-sm text-gray-500">0 - 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
