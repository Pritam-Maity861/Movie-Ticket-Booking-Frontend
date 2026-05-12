import { useState } from "react";
import { XIcon } from "lucide-react";
import { useLogin, useRegister } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate=useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const resetRegisterForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };
  const resetLoginForm = () => {
    setEmail("");
    setPassword("");
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
            navigate("/")
          },
        }
      );
    } else {
      registerMutation.mutate(
        { name, email, password },
        {
          onSuccess: () => {
            resetRegisterForm();
            onClose();
            navigate("/")
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

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              required
            />
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
            onClick={() => setIsLoginView(!isLoginView)}
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