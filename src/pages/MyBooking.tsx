import { getMyBookings } from "../services/api/booking-ep";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  HistoryIcon,
  TicketIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  SearchIcon,
} from "lucide-react";
import LoaderAnimation from "../components/LoaderAnimation";
import BlurBackground from "../components/BlurBackground";

const MyBooking = () => {
  const navigate = useNavigate();
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
    refetchInterval: 30000, // Refetch every 30s to update status
  });

  const bookings = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center px-6">
          <AlertCircleIcon className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-xl font-bold">Failed to load bookings</p>
          <p className="text-gray-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-32 text-white bg-black relative overflow-x-hidden">
      <BlurBackground top="10%" left="0%" />
      <BlurBackground bottom="0%" right="-5%" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <TicketIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">
                My Bookings
              </h1>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
              View your ticket history and pending reservations
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black italic uppercase text-gray-700 bg-white/5 border border-white/5 px-4 py-2 rounded-full tracking-[0.2em]">
              Total Records: {bookings?.length || 0}
            </span>
          </div>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-16 text-center">
            <SearchIcon className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-4">No Bookings Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest text-sm italic">
              You haven't made any movie reservations yet. Start by booking a
              movie today!
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all"
            >
              BROWSE MOVIES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookings.map((booking: any) => {
              const movie = booking.showtime.movie;
              const theater = booking.showtime.screen.theater;
              const isExpired =
                booking.status === "EXPIRED" ||
                (booking.status === "PENDING" &&
                  new Date(booking.expiresAt) < new Date());

              return (
                <div
                  key={booking.id}
                  className={`group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/10 hover:border-white/20 ${isExpired ? "opacity-80 grayscale-[0.5]" : ""}`}
                >
                  <div className="flex gap-6 p-6">
                    {/* Poster */}
                    <div className="w-28 h-40 md:w-32 md:h-48 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl md:text-2xl font-black italic truncate-2-lines leading-none pr-4">
                            {movie.title}
                          </h3>
                          {/* Status Indicator */}
                          <div
                            className={`shrink-0 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                              booking.status === "CONFIRMED"
                                ? "bg-green-500/10 border-green-500/30 text-green-500"
                                : isExpired
                                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                                  : "bg-primary/10 border-primary/30 text-primary animate-pulse"
                            }`}
                          >
                            {isExpired ? "Expired" : booking.status}
                          </div>
                        </div>

                        <div className="space-y-1 mt-4">
                          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <MapPinIcon className="w-3 h-3" /> {theater.name}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <CalendarIcon className="w-3 h-3" />{" "}
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleDateString([], {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            <ClockIcon className="w-3 h-3" />{" "}
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Seats & Price */}
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1">
                            Total Paid
                          </p>
                          <p className="text-xl font-black text-white italic tracking-tighter">
                            ₹{booking.totalAmount}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1">
                            Seats
                          </p>
                          <p className="text-xs font-black text-gray-400">
                            {booking.seats
                              .map((s: any) => `${s.seat.row}${s.seat.number}`)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 pt-2">
                    {booking.status === "CONFIRMED" ? (
                      <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border border-white/5 flex items-center justify-center gap-2">
                        View Ticket Details{" "}
                        <CheckCircle2Icon className="w-4 h-4 text-green-500" />
                      </button>
                    ) : isExpired ? (
                      <button
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border border-red-500/10 text-red-500 flex items-center justify-center gap-2"
                      >
                        Expired - Select New Seats{" "}
                        <AlertCircleIcon className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkout/${booking.id}`)}
                        className="w-full py-3 bg-primary hover:bg-primary-dull rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic shadow-lg shadow-primary/20 text-white flex items-center justify-center gap-2"
                      >
                        PROCEED TO PAYMENT <HistoryIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;
