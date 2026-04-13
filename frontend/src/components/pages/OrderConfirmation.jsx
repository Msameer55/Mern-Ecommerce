import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockOrders } from "../fakeData/ProductData";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // for now, using the latest mock order
    const latestOrder = mockOrders[mockOrders.length - 1];
    setOrder(latestOrder);
  }, []);

  if (!order)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="order-confirmation container mx-auto max-w-5xl py-10">
      <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">🎉 Thank You for Your Order!</h2>
        <p className="text-lg">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
      </div>

      <div className="shadow-md rounded-lg border p-6 bg-white">
        <h3 className="text-2xl font-semibold mb-4">Order Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 mb-6">
          <p><span className="font-bold">Order ID:</span> #{order.id}</p>
          <p><span className="font-bold">Order Date:</span> {order.createdAt.toLocaleDateString()}</p>
          <p>
            <span className="font-bold">Shipping Address:</span>{" "}
            {order.shippingAddress
              ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
              : "N/A"}
          </p>
          <p><span className="font-bold">Payment Method:</span> Cash on Delivery</p>
        </div>

        <h4 className="text-xl font-semibold mb-3">Ordered Items</h4>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Item Name</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  </td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">Rs {order.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-6 text-lg font-semibold">
          <p>Status:{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.isPaid ? "Paid" : "Pending"}
            </span>
          </p>
          <p>Total: Rs {order.totalPrice}</p>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
