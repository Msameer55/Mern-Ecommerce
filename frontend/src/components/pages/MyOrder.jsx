import React, { useEffect, useState } from "react";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      const mockOrders = [
        {
          _id: 1,
          createdAt: new Date(),
          shippingAddress: { city: "Karachi", country: "Pakistan" },
          orderItems: [
            {
              name: "Product 1",
              image: "https://picsum.photos/500/500?random=111",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: 2,
          createdAt: new Date(),
          shippingAddress: { city: "Karachi", country: "Pakistan" },
          orderItems: [
            {
              name: "Product 2",
              image: "https://picsum.photos/500/500?random=11",
            },
          ],
          totalPrice: 600,
          isPaid: false,
        },
      ];
      setOrders(mockOrders);
    }, 1000);
  }, []);

  return (
    <div className="my-order-container w-full p-4">
      <h3 className="text-2xl font-bold mb-4">My Orders</h3>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        {orders.length > 0 ? (
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Shipping Address</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
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
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {
                        (order.shippingAddress ?
                         `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                         : 
                         "N/A"
                        )
                    }
                   
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {order.orderItems[0].name}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    Rs {order.totalPrice}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-6 text-gray-500">No Orders to Show</p>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
