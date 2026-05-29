import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserActions, deleteUserAction, fetchUsers, updateUserActions } from "../../../redux/slice/adminSlice";
import { toast } from "react-toastify";
const AdminUser = () => {
  const { allUsers, loading, error } = useSelector((state) => state.admin);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const popupRef = useRef(null)
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(
        updateUserActions({
          id: userId,
          userData: { role: newRole },
        })
      );
      toast.success(`Role changed to ${newRole}`);
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    dispatch(addUserActions(form));
    setForm({ name: "", email: "", password: "", role: "customer" });
  };

  const handleDeleteUser = async (id) => {
    try {
      const result = await dispatch(deleteUserAction(id)).unwrap();
      toast.success(result.message || "User deleted");
      setDeleteUserId(null);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  }

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        {/* Add New User Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New User</h2>
          <form
            onSubmit={handleAddUser}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="cursor-pointer w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option className="cursor-pointer" value="Customer">Customer</option>
                <option className="cursor-pointer" value="Admin">Admin</option>
              </select>
            </div>

            <div className="col-span-1 flex items-end">
              <button
                type="submit"
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
              >
                Add User
              </button>
            </div>
          </form>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                <th className="py-3 px-4 font-medium">NAME</th>
                <th className="py-3 px-4 font-medium">EMAIL</th>
                <th className="py-3 px-4 font-medium">ROLE</th>
                <th className="py-3 px-4 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {allUsers?.map((user, idx) => (
                <tr
                  key={user._id}
                  className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className=" py-3 px-4">
                    <select
                      value={user.role}
                      className="cursor-pointer"
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option className="cursor-pointer" value="admin">Admin</option>
                      <option className="cursor-pointer" value="customer">Customer</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setDeleteUserId(user._id)}
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {
        (deleteUserId && deleteUserId != null) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteUserId(null)}>
            <div
              ref={popupRef}
              className="bg-white rounded-xl p-6 w-80 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="">
                <h2 className="text-lg font-semibold mb-2">Delete User?</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteUserId(null)}
                    className=" cursor-pointer flex-1 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteUser(deleteUserId)}
                    className=" cursor-pointer flex-1 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default AdminUser;
