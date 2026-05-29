import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("Logout successfully")
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout Failed")
    }

  };

  const navLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Shop", path: "/" },
    { name: "Subscribe Users", path: "/admin/subscribe-user" },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-[#0f172a] text-white w-64 transform transition-transform duration-300 z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="mt-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/admin"}
              className={({ isActive }) =>
                `block px-6 py-3 font-medium transition ${isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 w-full px-6">
          <button onClick={handleLogout} className="cursor-pointer flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-md">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={22} />
      </button>
    </>
  );
};

export default AdminSidebar;
