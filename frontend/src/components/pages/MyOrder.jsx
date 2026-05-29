import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../redux/slice/orderSlice";

const MyOrder = () => {
  const navigate = useNavigate();
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch])
  return (
    <div className="my-order-container w-full max-w-full overflow-hidden md:p-4">
      <h3 className="text-2xl font-bold mb-4">My Orders</h3>

      <div className="">
        {orders.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="max-h-[800px] overflow-y-auto">
              <table className="min-w-[700px] w-max border-collapse bg-white">
                <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4 text-left">Image</th>
                    <th className="py-3 px-4 text-left">Order ID</th>
                    <th className="py-3 px-4 text-left">Created At</th>
                    <th className="py-3 px-4 text-left">Shipping Address</th>
                    <th className="py-3 px-4 text-left">Items</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Payment</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-gray-50 transition duration-200 cursor-pointer"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      <td className="py-3 px-4">
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="w-12 h-12 rounded object-cover border"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        #{order._id}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(order?.createdAt).toISOString().split('T')[0]}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {order.shippingAddress
                          ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {order.orderItems[0].name}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        Rs {order.totalPrice}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700"
                            : order.status === "Shipped" ? "bg-blue-100 text-blue-700"
                              : order.status === "Processing" ? "bg-yellow-100 text-yellow-700"
                                : order.status === "Cancelled" ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500">No Orders to Show</p>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
