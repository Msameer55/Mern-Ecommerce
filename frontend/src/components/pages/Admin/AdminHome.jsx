import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminOrders } from "../../../redux/slice/adminOrderSlice";
import { fetchAllAdminProducts } from "../../../redux/slice/adminProductSlice";

const AdminHome = () => {
  const { totalOrders, totalSales, orders } = useSelector((state) => state.adminOrder);
  const { allAdminProduct } = useSelector((state) => state.adminProduct);
  const recentOrders = orders && orders.length > 0 ? [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5) : [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllAdminProducts())
    dispatch(getAllAdminOrders());
  }, [dispatch])

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg  p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Revenue</h3>
          <p className="text-2xl font-semibold">{totalSales}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg  p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Orders
          </h3>
          <p className="text-2xl font-semibold">{totalOrders}</p>
          <a
            href="/admin/orders"
            className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
          >
            Manage Orders
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Products
          </h3>
          <p className="text-2xl font-semibold">{allAdminProduct.length}</p>
          <a
            href="/admin/products"
            className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
          >
            Manage Products
          </a>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm  p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-3 px-4 font-semibold text-[13px]">ORDER ID</th>
                <th className="py-3 px-4 font-semibold text-[13px]">USER</th>
                <th className="py-3 px-4 font-semibold text-[13px]">TOTAL PRICE</th>
                <th className="py-3 px-4 font-semibold text-[13px]">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.user?.name || "Guest"}</td>
                  <td className="py-3 px-4">Rs {order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
