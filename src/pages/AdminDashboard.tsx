import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import { Menu } from "lucide-react";

const AdminDashboard = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-[#09090b] min-h-screen text-white font-sans selection:bg-primary/30 ">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-[#09090b]">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="text-sm font-bold tracking-wider text-primary">
            ADMIN
          </div>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </header>

        {/* Content Container */}
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
