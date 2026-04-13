import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    sizes: [],
    colors: [],
    material: "",
    brand: "",
    category: "",
    gender: "",
    collections: "",
    images: [],
  });

  useEffect(() => {
    if (state) {
      setForm({
        ...form,
        ...state,
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Product:", form);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Edit Product — {form.name || id}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="material"
            placeholder="Material"
            value={form.material}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={form.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="collections"
            placeholder="Collections"
            value={form.collections}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setForm({ ...form, images: [...e.target.files] })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
