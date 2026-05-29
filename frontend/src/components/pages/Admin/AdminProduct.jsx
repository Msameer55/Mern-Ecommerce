import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminDeleteProduct, fetchAllAdminProducts } from "../../../redux/slice/adminProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { allAdminProduct, loading, error } = useSelector((state) => state.adminProduct);
  console.log(allAdminProduct, "all admin product");
  const [productId, setProductId] = useState(null);
  const dispatch = useDispatch();
  const popupRef = useRef(null);
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const data = await dispatch(fetchAllAdminProducts()).unwrap();
      } catch (error) {
        toast.error(error || error?.message)
      }
    }
    getAllProducts();
  }, [dispatch])

  const handleClick = (product) => {
    navigate(`/admin/products/${product._id}/edit`, {
      state: product,
    })
  }

  const handleProductDelete = async (id) => {
    try {
      const response = await dispatch(adminDeleteProduct(id)).unwrap();
      toast.success(response.data || "Product has been deleted successfully")
      setProductId(null)
    } catch (error) {
      toast.error(error || error?.message)
      setProductId(null)
    }
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Add a Product
          </button>
        </div>

        {/* Products Table */}
        <div className="relative overflow-x-auto">
          <div className="max-h-[800px] overflow-y-auto overflow-x-auto max-w-[700px] lg:max-w-[100%]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Image</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">SKU</th>
                  <th className="p-3 border-b">Price (PKR)</th>
                  <th className="p-3 border-b">Discounted Price (PKR)</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allAdminProduct.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b whitespace-nowrap">{product._id}</td>
                    <td className="p-3 border-b whitespace-nowrap"><img src={product.images[0].url} alt="" className="w-20 h-20 object-cover" /></td>
                    <td className="p-3 border-b whitespace-nowrap">{product.name}</td>
                    <td className="p-3 border-b whitespace-nowrap">{product.sku}</td>
                    <td className="p-3 border-b whitespace-nowrap">{product.price}</td>
                    <td className="p-3 border-b whitespace-nowrap">{product.discountedPrice}</td>
                    <td className="p-3 border-b text-center">
                      <div className="flex ">
                        <button
                          onClick={() =>
                            handleClick(product)
                          }
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setProductId(product._id)}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md">
                          Delete
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {
        (productId && productId != null) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setProductId(null)}>
            <div
              ref={popupRef}
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
                    onClick={() => setProductId(null)}
                    className=" cursor-pointer flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleProductDelete(productId)}
                    className=" cursor-pointer flex-1 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default AdminProducts;
