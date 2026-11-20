import { Route, Routes, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBooking from "./pages/MyBooking";
import Checkout from "./pages/Checkout";
import Unauthorized from "./pages/Unauthorized";
import Footer from "./components/Footer";
import Releases from "./pages/Releases";
import AboutUs from "./pages/AboutUs";
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
import UsersManager from "./pages/admin/UsersManager";
import LoaderAnimation from "./components/LoaderAnimation";
import MovieShowtimes from "./pages/MovieShowtimes";
import ScrollToTop from "./utils/ScrollToTop";
import BookingSuccess from "./pages/BookingSuccess";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import TheaterOwnerDashboard from "./pages/TheaterOwnerDashboard";
import ApprovalsManager from "./pages/admin/ApprovalsManager";
import NotFound from "./pages/NotFound";

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
    return <LoaderAnimation />;
  }

  return (
    <>
      <ScrollToTop />
      <Toaster />
      <Routes>
        {/* Dedicated authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
        <Route path="/signup" element={<Login />} />

        {/* Routes with Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/movies/:id/showtimes" element={<MovieShowtimes />} />
          <Route
            path="/movies/:id/:showtimeId/:date"
            element={<SeatLayout />}
          />

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
            path="/checkout/:bookingId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-success/:bookingId"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/theater-owner-dashboard"
            element={
              <ProtectedRoute allowedRoles={["THEATER_OWNER", "ADMIN", "SUPER_ADMIN"]}>
                <TheaterOwnerDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="approvals" element={<ApprovalsManager />} />
          <Route path="movies" element={<MoviesManager />} />
          <Route path="genres" element={<GenresManager />} />
          <Route path="languages" element={<LanguagesManager />} />
          <Route path="theaters" element={<TheatersManager />} />
          <Route path="screens" element={<ScreensManager />} />
          <Route path="showtimes" element={<ShowtimesManager />} />
          <Route path="bookings" element={<BookingsManager />} />
          <Route path="payments" element={<PaymentsManager />} />
          <Route path="users" element={<UsersManager />} />
        </Route>

        {/* Permission and not-found routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
