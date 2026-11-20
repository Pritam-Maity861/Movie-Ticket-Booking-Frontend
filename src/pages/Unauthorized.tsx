import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, HomeIcon, LogIn, Building2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/auth-store";
import { useLogout } from "../hooks/useAuth";

const Unauthorized = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const state = (location.state as any) || {};
  const currentRole = (user?.role || state.currentRole || "USER").trim().toUpperCase();
  const requiredRoles: string[] = state.requiredRoles || ["ADMIN", "SUPER_ADMIN"];

  // Auto-redirect if the current user actually has an authorized role
  useEffect(() => {
    const userRole = (user?.role || "").trim().toUpperCase();
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      const target =
        state.from?.pathname &&
        state.from.pathname !== "/unauthorized" &&
        state.from.pathname !== "/login"
          ? state.from.pathname
          : "/admin-dashboard/approvals";
      navigate(target, { replace: true });
    }
  }, [user, navigate, state]);

  const handleSwitchAccount = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login", {
          state: {
            from: {
              pathname:
                state.from?.pathname && state.from.pathname !== "/unauthorized"
                  ? state.from.pathname
                  : "/admin-dashboard/approvals",
            },
          },
          replace: true,
        });
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white relative overflow-hidden px-4 py-20">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 md:w-140 h-80 md:h-140 bg-red-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full space-y-6">
        {/* Shield Icon */}
        <div className="relative bg-[#16161a] p-6 rounded-3xl border border-red-500/30 shadow-2xl shadow-red-500/10">
          <ShieldAlert className="w-16 h-16 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </div>

        {/* 403 Header */}
        <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-gray-300 to-gray-800 tracking-tighter">
          403
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-widest text-red-400">
            Access Restricted
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            You do not have the required permissions to view this section.
          </p>
        </div>

        {/* User Context Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full text-xs text-left space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-gray-400 font-semibold uppercase">Your Current Account</span>
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-white/10 text-white">
              {currentRole}
            </span>
          </div>
          <div className="text-gray-300">
            Signed in as: <strong className="text-white">{user?.name || "Guest"}</strong> ({user?.email || "No email"})
          </div>
          <div className="text-gray-400">
            Required role: <strong className="text-amber-400">{requiredRoles.join(" or ")}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
          {(currentRole === "ADMIN" || currentRole === "SUPER_ADMIN") && (
            <Link
              to="/admin-dashboard/approvals"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-full transition-all shadow-lg shadow-emerald-500/20 text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              Proceed to Approvals Panel
            </Link>
          )}

          {currentRole === "THEATER_OWNER" && (
            <Link
              to="/theater-owner-dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-full transition-all shadow-lg shadow-amber-500/20 text-xs"
            >
              <Building2 className="w-4 h-4" />
              Go to Theater Owner Dashboard
            </Link>
          )}

          <button
            onClick={handleSwitchAccount}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull text-white font-bold rounded-full transition-all shadow-lg shadow-primary/20 text-xs cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Switch Account / Sign in as Admin
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-full font-bold transition-all text-xs"
          >
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
