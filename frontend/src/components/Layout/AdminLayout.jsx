import { Outlet } from "react-router-dom";
import AdminSidebar from "../Common/AdminSidebar";

const AdminLayout = () => {

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
    

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 transition-all">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
