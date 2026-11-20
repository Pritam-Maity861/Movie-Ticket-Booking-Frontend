import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  MapPin,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Monitor,
  Tag,
  Languages,
  Ticket,
  CreditCard,
  X,
  ChevronLeft,
  LogOut,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { cn } from "../../lib/utils";

import { useAuthStore } from "../../store/auth-store";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

interface MenuItem {
  text: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin-dashboard",
  },
  {
    text: "Content",
    icon: <Film size={20} />,
    children: [
      {
        text: "Movies",
        path: "/admin-dashboard/movies",
        icon: <Film size={18} />,
      },
      {
        text: "Genres",
        path: "/admin-dashboard/genres",
        icon: <Tag size={18} />,
      },
      {
        text: "Languages",
        path: "/admin-dashboard/languages",
        icon: <Languages size={18} />,
      },
    ],
  },
  {
    text: "Venues",
    icon: <MapPin size={20} />,
    children: [
      {
        text: "Theaters",
        path: "/admin-dashboard/theaters",
        icon: <Monitor size={18} />,
      },
    ],
  },
  // {
  //   text: "Scheduling",
  //   icon: <Calendar size={20} />,
  //   children: [
  //     {
  //       text: "Showtimes",
  //       path: "/admin-dashboard/showtimes",
  //       icon: <Calendar size={18} />,
  //     },
  //   ],
  // },
  {
    text: "Orders",
    icon: <ShoppingBag size={20} />,
    children: [
      {
        text: "Bookings",
        path: "/admin-dashboard/bookings",
        icon: <Ticket size={18} />,
      },
      {
        text: "Payments",
        path: "/admin-dashboard/payments",
        icon: <CreditCard size={18} />,
      },
    ],
  },
  {
    text: "Approvals",
    icon: <ClipboardCheck size={20} />,
    path: "/admin-dashboard/approvals",
  },
  {
    text: "Users",
    icon: <Users size={20} />,
    path: "/admin-dashboard/users",
  },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    Content: true,
    Venues: true,
  });

  const { user } = useAuthStore();

  const handleLogout = () => {
    useAuthStore.getState().logOut();
    navigate("/");
  };

  // Automatically close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname, setIsMobileOpen]);

  const toggleMenu = (text: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenMenus((prev) => ({ ...prev, [text]: true }));
    } else {
      setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
    }
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (item: MenuItem) => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => isActive(child.path));
    }
    return false;
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div
        className={cn(
          "p-6 border-b border-white/5 flex items-center justify-between",
          isCollapsed ? "px-0 justify-center" : "px-6",
        )}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-linear-to-r from-primary to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
            <Film className="text-primary" />{" "}
            <span className="truncate">Admin Panel</span>
          </h1>
        )}
        {isCollapsed && (
          <Tooltip title="Admin Panel" placement="right">
            <Film className="text-primary w-8 h-8" />
          </Tooltip>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-white/60 hover:text-white p-1"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 text-sm font-medium overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = openMenus[item.text];
          const active = isParentActive(item);

          const renderWithTooltip = (element: React.ReactElement) => (
            <Tooltip
              title={isCollapsed ? item.text : ""}
              placement="right"
              arrow
              disableHoverListener={!isCollapsed} // Disable when expanded
            >
              {element}
            </Tooltip>
          );

          return (
            <div key={item.text} className="space-y-1">
              {hasChildren ? (
                renderWithTooltip(
                  <div className="relative group">
                    <button
                      onClick={() => toggleMenu(item.text)}
                      className={cn(
                        "w-full flex items-center p-2.5 rounded-lg transition-all duration-200 text-white/60 hover:text-white hover:bg-white/5",
                        active && "text-white bg-white/5",
                        isCollapsed ? "justify-center px-0" : "justify-between",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "transition-colors shrink-0",
                            active
                              ? "text-primary"
                              : "group-hover:text-primary",
                          )}
                        >
                          {item.icon}
                        </span>
                        {!isCollapsed && <span>{item.text}</span>}
                      </div>
                      {!isCollapsed &&
                        (isOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </button>
                  </div>,
                )
              ) : (
                <Link
                  to={item.path || "#"}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200 group text-white/60 hover:text-white hover:bg-white/5",
                    isActive(item.path) && "text-white bg-white/10 shadow-lg",
                    isCollapsed ? "justify-center px-0" : "",
                  )}
                  title={isCollapsed ? item.text : ""}
                >
                  <span
                    className={cn(
                      "transition-colors shrink-0",
                      isActive(item.path)
                        ? "text-primary"
                        : "group-hover:text-primary",
                    )}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.text}</span>}
                </Link>
              )}

              {hasChildren && isOpen && !isCollapsed && (
                <div className="ml-4 pl-4 border-l border-white/10 space-y-1 overflow-hidden transition-all duration-300">
                  {item.children?.map((child) => (
                    <Link
                      key={child.text}
                      to={child.path || "#"}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group text-white/40 hover:text-white hover:bg-white/5",
                        isActive(child.path) && "text-primary bg-primary/10",
                      )}
                    >
                      <span className="shrink-0">{child.icon}</span>
                      <span className="truncate">{child.text}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/5">
        <div
          className={cn(
            "bg-white/5 rounded-xl border border-white/10 transition-all duration-300",
            isCollapsed ? "p-2' flex justify-center" : "p-3",
          )}
        >
          {isCollapsed ? (
            <Tooltip title="Logout" placement="right">
              <button
                onClick={handleLogout}
                className="text-sm flex p-2 items-center gap-2 font-semibold text-red-500/80 hover:text-red-500 truncate cursor-pointer"
              >
                <LogOut />
              </button>
            </Tooltip>
          ) : (
            <>
              <p className="text-xs text-white/40 mb-1 leading-relaxed">
                Logged in as
              </p>
              <p className="text-sm font-semibold text-white/80 truncate">
                {user?.role} : {user?.name}
              </p>

              <button
                onClick={handleLogout}
                className="text-sm flex pt-3 items-center gap-2 font-semibold text-red-500/80 hover:text-red-500 truncate cursor-pointer"
              >
                <LogOut /> Logout
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex items-center justify-center p-4 text-white/40 hover:text-white transition-colors border-t border-white/5"
      >
        {isCollapsed ? (
          <Tooltip title="Expand Sidebar" placement="right">
            <ChevronRight size={20} />
          </Tooltip>
        ) : (
          <Tooltip title="Collapse Sidebar" placement="right">
            <div className="flex items-center gap-2">
              <ChevronLeft size={20} />{" "}
              <span className="text-xs">Collapse Sidebar</span>
            </div>
          </Tooltip>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Drawer) */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <aside className="relative w-72 h-full bg-[#09090b] border-r border-white/10 shadow-2xl">
          {SidebarContent}
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen bg-[#09090b] border-r border-white/10 sticky top-0 overflow-hidden transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {SidebarContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
