import { useEffect, useState } from "react";
import { getAdminStats } from "../../services/api/admin-ep";
import {
  Film,
  Ticket,
  Users,
  Landmark,
  TrendingUp,
  Calendar,
} from "lucide-react";
import LoaderAnimation from "../../components/LoaderAnimation";

const DashboardOverview = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoaderAnimation />
      </div>
    );
  }

  const stats = data?.stats || {
    movies: 0,
    bookings: 0,
    users: 0,
    theaters: 0,
    revenue: 0,
  };

  const statCards = [
    {
      title: "Total Movies",
      value: stats.movies,
      icon: Film,
      color: "text-blue-400",
    },
    {
      title: "Total Bookings",
      value: stats.bookings,
      icon: Ticket,
      color: "text-green-400",
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      color: "text-purple-400",
    },
    {
      title: "Total Theaters",
      value: stats.theaters,
      icon: Landmark,
      color: "text-orange-400",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-1">
            Quick summary of your cinema performance.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400">
          <Calendar size={16} />
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                <card.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-300 origin-left">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Recent Bookings
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-xs uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Movie</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.recentBookings?.map((booking: any) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {booking.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {booking.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">
                        {booking.showtime.movie.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">
                        ₹{booking.totalAmount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-500/10 text-green-500"
                            : booking.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!data?.recentBookings ||
                  data.recentBookings.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
