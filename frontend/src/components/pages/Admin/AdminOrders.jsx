import React, { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "Ali Khan",
      total: 8500,
      status: "Processing",
    },
    {
      id: "ORD-1002",
      customer: "Sara Ahmed",
      total: 12000,
      status: "Shipped",
    },
    {
      id: "ORD-1003",
      customer: "Hamza Iqbal",
      total: 4300,
      status: "Delivered",
    },
  ]);

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  const markAsDelivered = (id) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "Delivered" } : order
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Orders</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Order ID</th>
              <th className="p-3 border-b">Customer</th>
              <th className="p-3 border-b">Total (PKR)</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 border-b">{order.id}</td>
                <td className="p-3 border-b">{order.customer}</td>
                <td className="p-3 border-b">{order.total}</td>
                <td className="p-3 border-b">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className={`border rounded-md px-2 py-1 ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3 border-b text-center">
                  {order.status === "Delivered" ? (
                    <button
                      disabled
                      className="bg-green-600 text-white px-3 py-1 rounded-md cursor-default"
                    >
                      <span className="flex gap-2 items-center">
                        <IoMdCheckmark  /> Delivered
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => markAsDelivered(order.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                    >
                      Mark as Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
