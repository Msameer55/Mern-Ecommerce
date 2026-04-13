import React from "react";

const AdminHome = () => {
  const recentOrders = [
    { id: "123123", user: "John Doe", total: 110, status: "Processing" },
    { id: "123124", user: "Jane Smith", total: 220, status: "Processing" },
    { id: "123125", user: "Ali Khan", total: 180, status: "Processing" },
    { id: "123126", user: "Emma Brown", total: 130, status: "Processing" },
    { id: "123127", user: "Noah Lee", total: 95, status: "Processing" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg  p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Revenue</h3>
          <p className="text-2xl font-semibold">$10000</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg  p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Orders
          </h3>
          <p className="text-2xl font-semibold">200</p>
          <a
            href="#"
            className="text-blue-600 text-sm font-medium hover:underline mt-2 inline-block"
          >
            Manage Orders
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Total Products
          </h3>
          <p className="text-2xl font-semibold">100</p>
          <a
            href="#"
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
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.user}</td>
                  <td className="py-3 px-4">${order.total}</td>
                  <td className="py-3 px-4 text-gray-600">{order.status}</td>
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
