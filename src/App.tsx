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
import { refreshTokenApi } from "./services/api/auth-ep";
import { tokenManager } from "./lib/token-manager";
import { useAuthStore } from "./store/auth-store";
import ProtectedRoute from "./services/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import MoviesManager from "./pages/admin/MoviesManager";
import GenresManager from "./pages/admin/GenresManager";
import LanguagesManager from "./pages/admin/LanguagesManager";
import TheatersManager from "./pages/admin/TheatersManager";
import ScreensManager from "./pages/admin/ScreensManager";
import ShowtimesManager from "./pages/admin/ShowtimesManager";
import BookingsManager from "./pages/admin/BookingsManager";
import PaymentsManager from "./pages/admin/PaymentsManager";
import LoaderAnimation from "./components/LoaderAnimation";

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
      <LoaderAnimation/>
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

        {/* admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="movies" element={<MoviesManager />} />
          <Route path="genres" element={<GenresManager />} />
          <Route path="languages" element={<LanguagesManager />} />
          <Route path="theaters" element={<TheatersManager />} />
          <Route path="screens" element={<ScreensManager />} />
          <Route path="showtimes" element={<ShowtimesManager />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="payments" element={<PaymentsManager />} />
        </Route>

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
