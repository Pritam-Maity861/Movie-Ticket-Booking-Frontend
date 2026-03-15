import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SaetLayout from "./pages/SaetLayout";
import MyBooking from "./pages/MyBooking";
import Favorite from "./pages/Favorite";
import Unauthorized from "./pages/Unauthorized";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Film } from "lucide-react";
import { refreshTokenApi } from "./services/api/auth-ep";
import { tokenManager } from "./lib/token-manager";
import { useAuthStore } from "./store/auth-store";
import ProtectedRoute from "./services/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const AppContent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshTokenApi();

        console.log(data);

        tokenManager.setToken(data.data.accessToken);
        useAuthStore.getState().setUser(data.data.user);
      } catch {
        tokenManager.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#09090b]">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute w-32 h-32 border border-primary/20 rounded-full"></div>

          {/* Inner ring track */}
          <div className="absolute w-24 h-24 border-2 border-primary/10 rounded-full"></div>

          {/* Spinning ring */}
          <div className="absolute w-24 h-24 border-2 border-primary rounded-full border-t-transparent animate-spin"></div>

          {/* Pulsing Film Icon */}
          <div className="relative animate-pulse">
            <Film className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(248,69,101,0.6)]" />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 z-10">
          <h2 className="text-sm font-medium tracking-[0.4em] text-white/80 uppercase animate-pulse">
            Loading...
          </h2>
          <div className="flex gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        {/* Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/:id/:date" element={<SaetLayout />} />

          {/* logged-in users */}
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorite"
            element={
              <ProtectedRoute>
                <Favorite />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* admin only (no Navbar/Footer) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* catch-all (no Navbar/Footer) */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
