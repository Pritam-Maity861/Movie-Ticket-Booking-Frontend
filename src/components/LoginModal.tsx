import { useState } from "react";
import { XIcon, EyeIcon, EyeOffIcon, Ticket, Building2 } from "lucide-react";
import { useLogin, useRegister } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "THEATER_OWNER">("USER");
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const resetRegisterForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setShowPassword(false);
  };
  const resetLoginForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handlePostAuthRedirect = () => {
    const currentUser = useAuthStore.getState().user;
    if (currentUser?.role === "THEATER_OWNER") {
      navigate("/theater-owner-dashboard");
    } else if (currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN") {
      navigate("/admin-dashboard");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginView) {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            resetLoginForm();
            onClose();
            handlePostAuthRedirect();
          },
        }
      );
    } else {
      registerMutation.mutate(
        { name, email, password, role },
        {
          onSuccess: () => {
            resetRegisterForm();
            onClose();
            handlePostAuthRedirect();
          },
        }
      );
    }
  };

  const errorMessage =
    loginMutation.error?.message ||
    registerMutation.error?.message ||
    null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h2>

          <p className="text-gray-400 text-sm">
            {isLoginView
              ? "Login to book your favorite movies"
              : "Sign up to join our community"}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Account Type Selection (Sign Up only) */}
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 block">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("USER")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === "USER"
                      ? "bg-primary/10 border-primary text-white"
                      : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      role === "USER"
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Moviegoer</div>
                    <div className="text-[10px] text-gray-400">Book tickets</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("THEATER_OWNER")}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    role === "THEATER_OWNER"
                      ? "bg-primary/10 border-primary text-white"
                      : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-white"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      role === "THEATER_OWNER"
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Theater Owner</div>
                    <div className="text-[10px] text-gray-400">Manage cinema</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Register Name */}
          {!isLoginView && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300">
                Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                required
              />
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-4 pr-11 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
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

          {/* Forgot Password */}
          {/* {isLoginView && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary-dull transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )} */}

          {/* Error */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-3 mt-4 bg-primary hover:bg-primary-dull disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/30 cursor-pointer"
          >
            {isLoginView
              ? isLoading
                ? "Logging in..."
                : "Login"
              : isLoading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        {/* Switch Mode */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {isLoginView
            ? "Don't have an account? "
            : "Already have an account? "}

          <button
            disabled={isLoading}
            onClick={() => {
              setIsLoginView(!isLoginView);
              setShowPassword(false);
            }}
            className="text-primary hover:text-primary-dull font-semibold transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
          >
            {isLoginView ? "Sign up" : "Login"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;