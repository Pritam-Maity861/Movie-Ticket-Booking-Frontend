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
import { generateTicketPDF } from "../utils/generateTicket";

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
    <div className="min-h-screen pt-28 pb-32 text-white bg-[#09090b] relative overflow-x-hidden">
      <BlurBackground top="10%" left="-10%" />
      <BlurBackground bottom="0%" right="-10%" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 z-10 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-[1.25rem] bg-linear-to-br from-primary to-primary-dull flex items-center justify-center shadow-lg shadow-primary/20">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-500">
                My Bookings
              </h1>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] pl-1">
              Your Cinematic Journey History
            </p>
          </div>
          <div className="text-right animate-in fade-in duration-1000">
            <span className="text-[10px] font-black italic uppercase text-gray-400 bg-white/5 border border-white/10 px-6 py-3 rounded-full tracking-[0.2em] backdrop-blur-md">
              Total Records: {bookings?.length || 0}
            </span>
          </div>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-[#121214]/50 backdrop-blur-xl border border-white/10 rounded-[4rem] p-24 text-center animate-in zoom-in duration-500 shadow-2xl">
            <div className="relative inline-block mb-8">
              <SearchIcon className="w-24 h-24 text-white/5 mx-auto" />
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full"></div>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight italic">
              No Bookings Found
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-12 font-bold uppercase tracking-[0.15em] text-xs leading-relaxed">
              Your ticket wallet is empty. Let's find some amazing movies for
              you!
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-12 py-6 bg-primary hover:bg-primary-dull text-white rounded-[2.5rem] font-black tracking-widest text-sm uppercase shadow-2xl shadow-primary/40 active:scale-95 transition-all"
            >
              EXPLORE MOVIES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {bookings.map((booking: any, index: number) => {
              const movie = booking.showtime.movie;
              const theater = booking.showtime.screen.theater;
              const isExpired =
                booking.status === "EXPIRED" ||
                (booking.status === "PENDING" &&
                  new Date(booking.expiresAt) < new Date());

              return (
                <div
                  key={booking.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`group relative bg-[#121214]/60 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:bg-[#18181b]/80 hover:border-white/20 shadow-xl hover:shadow-2xl animate-in fade-in slide-in-from-bottom-8 ${
                    isExpired ? "opacity-70 grayscale-[0.3]" : ""
                  }`}
                >
                  <div className="flex gap-8 p-8">
                    {/* Poster */}
                    <div className="w-32 h-48 md:w-36 md:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 ring-1 ring-white/10">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-2xl md:text-3xl font-black italic truncate-2-lines leading-none tracking-tighter hover:text-primary transition-colors cursor-default">
                            {movie.title}
                          </h3>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                              <MapPinIcon className="w-3 h-3 text-primary" />
                            </div>
                            <span className="truncate">{theater.name}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                              <CalendarIcon className="w-3 h-3 text-primary" />
                            </div>
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleDateString([], {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-3 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                            <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0">
                              <ClockIcon className="w-3 h-3 text-primary" />
                            </div>
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Status & Badge */}
                      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-6">
                        <div
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-500/10 border-green-500/20 text-green-500"
                              : isExpired
                                ? "bg-red-500/10 border-red-500/20 text-red-500"
                                : "bg-primary/10 border-primary/20 text-primary animate-pulse"
                          }`}
                        >
                          {isExpired ? "Expired" : booking.status}
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase text-gray-600 tracking-widest mb-1">
                            Amount Paid
                          </p>
                          <p className="text-2xl font-black text-white italic tracking-tighter">
                            ₹{booking.totalAmount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-8 pb-8 pt-2">
                    {booking.status === "CONFIRMED" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() =>
                            navigate(`/booking-success/${booking.id}`)
                          }
                          className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border border-white/5 flex items-center justify-center gap-2 group"
                        >
                          Details{" "}
                          <CheckCircle2Icon className="w-4 h-4 text-green-500 group-hover:scale-125 transition-transform" />
                        </button>
                        <button
                          onClick={() => generateTicketPDF(booking)}
                          className="py-4 bg-green-600 hover:bg-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic text-white shadow-lg shadow-green-500/10 flex items-center justify-center gap-2 group"
                        >
                          <TicketIcon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
                          Get Ticket
                        </button>
                      </div>
                    ) : isExpired ? (
                      <button
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="w-full py-4 bg-red-500/5 hover:bg-red-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic border border-red-500/10 text-red-500 flex items-center justify-center gap-2 group"
                      >
                        REBOOK SEATS{" "}
                        <AlertCircleIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkout/${booking.id}`)}
                        className="w-full py-5 bg-primary hover:bg-primary-dull rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all italic shadow-2xl shadow-primary/30 text-white flex items-center justify-center gap-3 overflow-hidden group relative"
                      >
                        <span className="relative z-10">
                          CONTINUE TO PAYMENT
                        </span>
                        <HistoryIcon className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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
