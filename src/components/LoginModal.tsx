import { useState } from "react";
import { XIcon } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [isLoginView, setIsLoginView] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <XIcon className="w-6 h-6" />
        </button>

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

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLoginView && (
            <>
              {/* Profile Picture Option - You can hook this up to S3 or a multipart form later */}
              <div className="space-y-1 hidden">
                <label className="text-sm font-medium text-gray-300">
                  Profile Picture (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
              required
            />
          </div>

          {isLoginView && (
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-primary hover:text-primary-dull transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center py-3 mt-4 bg-primary hover:bg-primary-dull disabled:bg-primary/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/30 cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isLoginView
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
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
