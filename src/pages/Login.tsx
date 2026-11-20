import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Ticket, ArrowLeft, Building2 } from "lucide-react";
import { useLogin, useRegister } from "../hooks/useAuth";
import { assets } from "../assets/assets";
import { useAuthStore } from "../store/auth-store";

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "THEATER_OWNER">("USER");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const navigatePostAuth = () => {
    const currentUser = useAuthStore.getState().user;
    const userRole = (currentUser?.role || "").trim().toUpperCase();
    const targetPath =
      from && from !== "/" && from !== "/unauthorized" && from !== "/login"
        ? from
        : null;

    if (targetPath) {
      navigate(targetPath, { replace: true });
    } else if (userRole === "THEATER_OWNER") {
      navigate("/theater-owner-dashboard", { replace: true });
    } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      navigate("/admin-dashboard/approvals", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginView) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            navigatePostAuth();
          },
        },
      );
    } else {
      registerMutation.mutate(
        { name, email, password, role },
        {
          onSuccess: () => {
            navigatePostAuth();
          },
        },
      );
    }
  };

  const errorMessage =
    loginMutation.error?.message || registerMutation.error?.message || null;

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/15 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-10 md:left-12 flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src={assets.logo} alt="Logo" className="w-44 h-auto mx-auto" />
          </Link>
          <h2 className="text-3xl font-black tracking-tight mb-2">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-xs font-semibold">
            {isLoginView
              ? "Sign in to access your bookings and reserve tickets"
              : "Join our cinema community to unlock seamless booking"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Type Selection (Sign Up only) */}
            {!isLoginView && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("USER")}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      role === "USER"
                        ? "bg-primary/10 border-primary text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        role === "USER"
                          ? "bg-primary text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Moviegoer</div>
                      <div className="text-[10px] text-gray-400">Book tickets</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("THEATER_OWNER")}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      role === "THEATER_OWNER"
                        ? "bg-primary/10 border-primary text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg ${
                        role === "THEATER_OWNER"
                          ? "bg-primary text-white"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Theater Owner</div>
                      <div className="text-[10px] text-gray-400">Manage cinema</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Name Field (Sign Up only) */}
            {!isLoginView && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 text-sm"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 text-sm"
                required
              />
            </div>

            {/* Password Field with visibility toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-4 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer p-0.5 focus:outline-none disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-400 text-xs font-semibold text-center bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-primary hover:bg-primary-dull disabled:bg-primary/50 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/25 cursor-pointer text-xs uppercase tracking-widest"
            >
              <Ticket className="w-4 h-4" />
              {isLoginView
                ? isLoading
                  ? "Signing In..."
                  : "Sign In"
                : isLoading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-gray-400">
            {isLoginView
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                setIsLoginView(!isLoginView);
                setShowPassword(false);
              }}
              className="text-primary hover:text-primary-dull font-bold transition-colors cursor-pointer ml-1"
            >
              {isLoginView ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

