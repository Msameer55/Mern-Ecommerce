import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockOrders } from "../fakeData/ProductData";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const foundOrder = mockOrders.find((o) => o.id === id);
    setOrder(foundOrder);
  }, [id]);

  if (!order)
    return (
      <p className="text-center mt-10 text-gray-500">Order not found.</p>
    );

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
      >
        ← <span>Back to My Orders</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🧾 Order Summary
        </h2>

        {/* Order Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><span className="font-semibold">Order ID:</span> #{order._id}</p>
            <p><span className="font-semibold">Date:</span> {order.createdAt.toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <span className="font-semibold">Shipping:</span>{" "}
              {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
              {order.shippingAddress.country}
            </p>
            <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto rounded-xl bg-gray-50">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
              <tr>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Qty</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-white transition border-b border-gray-100"
                >
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-md object-cover shadow-sm"
                    />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-4 px-4">{item.qty}</td>
                  <td className="py-4 px-4">Rs {item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 font-semibold">
                    Rs {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status & Total */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p>
            Status:{" "}
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                order.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.isPaid ? "Paid" : "Pending"}
            </span>
          </p>
          <h3 className="text-2xl font-bold text-gray-800">
            Total: Rs {order.totalPrice.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
