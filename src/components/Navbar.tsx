import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { MenuIcon, XIcon, UserCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import LoginModal from "../components/LoginModal";
import { useAuthStore } from "../store/auth-store";
import toast from "react-hot-toast";
import { useAllDevicesLogout, useLogout } from "../hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allDeviceLogOut = useAllDevicesLogout();
  const logOutSingleDevice = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { user, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    try {
      logOutSingleDevice.mutate();
    } catch (err) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout failed:", err);
    }
  };

  const handleAllDevicesLogout = () => {
    try {
      allDeviceLogOut.mutate();
    } catch (err) {
      toast.error("Logout for all devices failed. Please try again.");
      console.error("Logout for all devices failed failed:", err);
    }
  };

  return (
    <>
      {/* LOGIN MODAL */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <div className="top-0 fixed w-full z-50 left-0 flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
        {/* LOGO */}
        <Link to="/" className="max-md:flex-1">
          <img src={assets.logo} alt="logo" className="w-40 h-auto" />
        </Link>

        {/* NAV LINKS */}
        <div
          className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${
            isOpen ? "max-md:w-full" : "max-md:w-0"
          }`}
        >
          <XIcon
            className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          {[
            { path: "/", name: "Home" },
            { path: "/movies", name: "Movies" },
            { path: "/releases", name: "Releases" },
            { path: "/about-us", name: "About Us" },
            ...(isAuthenticated
              ? [{ path: "/my-bookings", name: "My Bookings" }]
              : []),
          ].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => {
                scrollTo(0, 0);
                setIsOpen(false);
              }}
              className="group relative text-white text-lg font-mono transition-colors duration-300"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-linear-to-r from-red-500 via-pink-500 to-orange-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull cursor-pointer transition rounded-full font-medium"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600 hover:border-primary transition overflow-hidden">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f0f11] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-md">
                  <div className="px-4 py-3 border-b border-gray-800 bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-white font-semibold truncate leading-tight">
                        {user?.name || "User"}
                      </p>
                      {user?.role && user.role !== "USER" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                          {user.role === "THEATER_OWNER" ? "Theater Owner" : user.role}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-1">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    {user?.role === "THEATER_OWNER" && (
                      <Link
                        to="/theater-owner-dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-amber-400 font-medium hover:bg-white/10 hover:text-amber-300 transition"
                      >
                        🏛️ Theater Owner Dashboard
                      </Link>
                    )}
                    {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
                      <Link
                        to="/admin-dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-primary font-medium hover:bg-white/10 hover:text-primary transition"
                      >
                        ⚡ Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
                    >
                      Manage Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-white/10 transition cursor-pointer mt-1"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleAllDevicesLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-white/10 transition cursor-pointer mt-1"
                    >
                      Logout from All device
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <MenuIcon
          className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </div>
    </>
  );
};

export default Navbar;
