import React from "react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate = useNavigate();

  const products = [
    { id: "P001", name: "Wireless Headphones", sku: "WH-1234", price: 4500 },
    { id: "P002", name: "Smart Watch", sku: "SW-5678", price: 6500 },
    { id: "P003", name: "Bluetooth Speaker", sku: "BS-9101", price: 3200 },
  ];

  const handleClick = (product) => {
    navigate(`/admin/products/${product.id}/edit`, {
        state: product, // 👈 send product info
        })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">All Products</h2>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Add a Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">SKU</th>
              <th className="p-3 border-b">Price (PKR)</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 border-b">{product.id}</td>
                <td className="p-3 border-b">{product.name}</td>
                <td className="p-3 border-b">{product.sku}</td>
                <td className="p-3 border-b">{product.price}</td>
                <td className="p-3 border-b text-center">
                  <button
                    onClick={() =>
                     handleClick(product)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
