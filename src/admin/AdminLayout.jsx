
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import useAdminLogoutSync from "../hooks/useAdminLogoutSync";
export default function AdminLayout() {
  useAdminLogoutSync();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F2]">

      {/* Sidebar - Does Not Scroll */}
      <aside className="w-64 h-screen flex-shrink-0 bg-white border-r border-[#E9E5DB] ">
        <AdminSidebar />
      </aside>

      {/* Right Side */}
      <div className="flex-1 min-w-0 h-screen flex flex-col">

        {/* Header Stays at Top */}
        <div className="flex-shrink-0">
          <AdminHeader />
        </div>

        {/* Only This Area Scrolls */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
