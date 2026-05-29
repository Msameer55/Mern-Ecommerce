import React, { useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllAdminOrders,
  updateAdminOrders,
} from "../../../redux/slice/adminOrderSlice";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.adminOrder);
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  useEffect(() => {
    dispatch(getAllAdminOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(
        updateAdminOrders({ id, updateOrder: newStatus })
      );
      toast.success("Status updated successfully");
      dispatch(getAllAdminOrders());
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const markAsDelivered = async (id) => {
    try {
      await dispatch(
        updateAdminOrders({ id, updateOrder: "Delivered" })
      );
      toast.success("Order marked as delivered");
      dispatch(getAllAdminOrders());
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Orders</h2>
        <span className="text-sm text-gray-500">
          Total: {orders?.length || 0}
        </span>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-sm rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-sm bg-gray-50 border-b">
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders &&
              sortedOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* ORDER ID */}
                  <td className="p-4">
                    <div className="font-medium text-sm">
                      #{order._id.slice(-6)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* CUSTOMER */}
                  <td className="p-4">
                    <div className="font-medium">
                      {order.user?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.user?.email}
                    </div>
                  </td>

                  {/* TOTAL */}
                  <td className="p-4 font-semibold">
                    Rs {order.totalPrice.toFixed(2)}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`text-xs px-3 py-1 rounded-full border ${statusStyle(
                        order.status
                      )}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 text-center">
                    {order.status === "Delivered" ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <IoMdCheckmark /> Delivered
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          markAsDelivered(order._id)
                        }
                        className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:opacity-80"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Empty state */}
        {orders?.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;