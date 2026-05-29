import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetailsByID } from "../../redux/slice/orderSlice";
import { FaArrowLeft } from "react-icons/fa";
import ReactSpinner from "../ReactSpinner";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderDetails: order, loading, error } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (id) dispatch(fetchOrderDetailsByID(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <ReactSpinner />
      </div>
    );

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!order)
    return (
      <p className="text-center mt-10 text-gray-500">Order not found.</p>
    );

  const steps = ["Processing", "Shipped", "Delivered"];

  const statusColor = {
    Processing: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="inner-container my-16 mb-24 px-4 md:px-8 max-w-7xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer mb-6 flex items-center gap-2 text-sm hover:underline"
      >
        <FaArrowLeft /> Back to Orders
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Order #{order._id}</h2>
            <p className="text-sm text-gray-500">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => {
            const isActive =
              steps.indexOf(order.status) >= index;

            return (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm ${isActive ? "bg-black" : "bg-gray-300"
                    }`}
                >
                  {index + 1}
                </div>

                <span className="ml-2 text-xs sm:text-sm">
                  {step}
                </span>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${isActive ? "bg-black" : "bg-gray-300"
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h3 className="font-semibold mb-4">Items</h3>

        <div className="space-y-4">
          {order.orderItems.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 border-b pb-4 last:border-0"
            >
              <img
                src={item.image}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>

                <p className="text-sm text-gray-500">
                  Size: {item.size} | Color: {item.color}
                </p>

                <p className="text-sm mt-1">
                  Qty: {item.quantity}
                </p>

                <div className="flex justify-between mt-2 text-sm">
                  <span>Rs {item.price}</span>
                  <span className="font-semibold">
                    Rs {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Shipping */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-3">Shipping Address</h3>

          <p>
            {order.shippingAddress.firstName}{" "}
            {order.shippingAddress.lastName}
          </p>
          <p className="text-sm text-gray-500">
            {order.shippingAddress.address}
          </p>
          <p className="text-sm text-gray-500">
            {order.shippingAddress.city},{" "}
            {order.shippingAddress.country}
          </p>
          <p className="text-sm text-gray-500">
            {order.shippingAddress.phone}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-3">Payment</h3>

          <p className="text-sm">
            Method:{" "}
            <span className="font-medium capitalize">
              {order.paymentMethod}
            </span>
          </p>

          <p className="text-sm mt-2">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded text-xs ${order.isPaid
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
                }`}
            >
              {order.isPaid ? "Paid" : "Pending"}
            </span>
          </p>

          {order.paidAt && (
            <p className="text-sm mt-2 text-gray-500">
              Paid on{" "}
              {new Date(order.paidAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <h3 className="font-semibold mb-4">Price Details</h3>

        <div className="flex justify-between text-sm mb-2">
          <span>Items Total</span>
          <span>Rs {order.totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Shipping</span>
          <span>Rs 0</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>Rs {order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3 flex-wrap">
        {!order.isDelivered && (
          <button className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;