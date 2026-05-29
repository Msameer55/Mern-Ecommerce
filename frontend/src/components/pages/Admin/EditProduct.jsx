import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { adminUpdateProduct } from "../../../redux/slice/adminProductSlice";
import axiosInstance from "../../../config/axios";
import CreatableSelect from "react-select/creatable";

const EditProduct = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.adminProduct);
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    discountedPrice: "",
    sizes: [],
    colors: [],
    countInStock: "",
    material: "",
    brand: "",
    category: "",
    gender: "",
    collections: "",
    images: [],
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    materials: [],
    collections: [],
    genders: [],
    colors: [],
    sizes: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const removeNewImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== url),
    }));
  };

  useEffect(() => {
    if (state) {
      setForm((prev) => ({
        ...prev,
        ...state,
        sizes: Array.isArray(state.sizes) ? state.sizes : (typeof state.sizes === "string" ? state.sizes.split(",").map(s=>s.trim()).filter(Boolean) : []),
        colors: Array.isArray(state.colors) ? state.colors : (typeof state.colors === "string" ? state.colors.split(",").map(c=>c.trim()).filter(Boolean) : []),
      }));
    }
  }, [state]);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploadedImageUrls = [...form.images];

      // 1. Upload new images if any
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("image", file);
          const res = await axiosInstance.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          uploadedImageUrls.push({ url: res.data.imageUrl, altText: form.name });
        }
      }

      // 2. Prepare final product data
      const productData = {
        ...form,
        images: uploadedImageUrls,
      };

      const data = await dispatch(adminUpdateProduct({
        id,
        productData
      })).unwrap();
      toast.success(data.message);
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    } finally {
      setUploading(false);
    }
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
          <div className="w-full">


            <label className="block mb-2" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="w-full">
            <label className="block mb-2" htmlFor="sku">SKU</label>
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={form.sku}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="w-full">
            <label className="block mb-2" htmlFor="discountedPrice">Discounted Price</label>
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={form.discountedPrice}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="brand">Brand</label>
            <CreatableSelect
              name="brand"
              options={filterOptions.brands.map(b => ({ label: b, value: b }))}
              value={form.brand ? { label: form.brand, value: form.brand } : null}
              onChange={(selected) => setForm({ ...form, brand: selected ? selected.value : "" })}
              placeholder="Select or create..."
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="category">Category</label>
            <CreatableSelect
              name="category"
              options={filterOptions.categories.map(c => ({ label: c, value: c }))}
              value={form.category ? { label: form.category, value: form.category } : null}
              onChange={(selected) => setForm({ ...form, category: selected ? selected.value : "" })}
              placeholder="Select or create..."
            />
          </div>
          <div className="w-full">
            <label className="block mb-2" htmlFor="material">Material</label>
            <CreatableSelect
              name="material"
              options={filterOptions.materials.map(m => ({ label: m, value: m }))}
              value={form.material ? { label: form.material, value: form.material } : null}
              onChange={(selected) => setForm({ ...form, material: selected ? selected.value : "" })}
              placeholder="Select or create..."
            />
          </div>
          <div className="w-full">
            <label className="block mb-2" htmlFor="gender">Gender</label>
            <CreatableSelect
              name="gender"
              options={filterOptions.genders.map(g => ({ label: g, value: g }))}
              value={form.gender ? { label: form.gender, value: form.gender.toLowerCase() } : null}
              onChange={(selected) => setForm({ ...form, gender: selected ? selected.value.toLowerCase() : "" })}
              placeholder="Select or create..."
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="countInStock">Count In Stock</label>
            <input
              type="number"
              name="countInStock"
              placeholder="Count In Stock"
              value={form.countInStock}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="sizes">Sizes</label>
            <CreatableSelect
              isMulti
              name="sizes"
              options={filterOptions.sizes.map(s => ({ label: s, value: s }))}
              value={form.sizes.map(s => ({ label: s, value: s }))}
              onChange={(selected) => setForm({ ...form, sizes: selected ? selected.map(o => o.value) : [] })}
              placeholder="Select or create sizes..."
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="colors">Colors</label>
            <CreatableSelect
              isMulti
              name="colors"
              options={filterOptions.colors.map(c => ({ label: c, value: c }))}
              value={form.colors.map(c => ({ label: c, value: c }))}
              onChange={(selected) => setForm({ ...form, colors: selected ? selected.map(o => o.value) : [] })}
              placeholder="Select or create colors..."
            />
          </div>

          <div className="w-full">
            <label className="block mb-2" htmlFor="collections">Collections</label>
            <CreatableSelect
              name="collections"
              options={filterOptions.collections.map(c => ({ label: c, value: c }))}
              value={form.collections ? { label: form.collections, value: form.collections } : null}
              onChange={(selected) => setForm({ ...form, collections: selected ? selected.value : "" })}
              placeholder="Select or create..."
            />
          </div>

        </div>
        <label className="block mb-2" htmlFor="description">Product Description</label>
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-md px-3 py-2 w-full w-full"
        />

        <div>
          <label className="block text-sm font-medium mb-2">Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-gray-500">Drag & drop or click to upload images</p>
          </div>

          {/* Existing Images */}
          {form.images.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Existing Images</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {form.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Product ${index}`}
                      className="w-full h-24 object-cover rounded-md shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">New Images (to be uploaded)</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New Preview ${index}`}
                      className="w-full h-24 object-cover rounded-md shadow-sm border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {uploading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
