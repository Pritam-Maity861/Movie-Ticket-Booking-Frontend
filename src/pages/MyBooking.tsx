import { getMyBookings } from "../services/api/booking-ep";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  TicketIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  SearchIcon,
} from "lucide-react";
import LoaderAnimation from "../components/LoaderAnimation";
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
    <div className="min-h-screen pt-24 pb-20 text-white bg-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TicketIcon className="w-6 h-6 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">
                My Bookings
              </h1>
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest pl-1">
              Booking History
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
              Total Records: {bookings?.length || 0}
            </span>
          </div>
        </div>

        {!bookings || bookings.length === 0 ? (
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-12 md:p-24 text-center">
            <SearchIcon className="w-16 h-16 text-white/5 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">No Bookings Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
              You haven't booked any tickets yet. Let's find some amazing movies
              for you!
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-10 py-4 bg-primary hover:bg-primary-dull text-white rounded-xl font-bold text-xs uppercase"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors ${
                    isExpired ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex gap-6 p-6">
                    {/* Poster */}
                    <div className="w-24 h-36 md:w-28 md:h-40 rounded-lg overflow-hidden shrink-0 bg-white/5">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold mb-3 truncate leading-snug">
                          {movie.title}
                        </h3>

                        <div className="space-y-1.5 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                            <MapPinIcon className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate">{theater.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="w-3.5 h-3.5 text-primary" />
                            {new Date(
                              booking.showtime.startTime,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-500/10 text-green-500"
                              : isExpired
                                ? "bg-red-500/10 text-red-500"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          {isExpired ? "Expired" : booking.status}
                        </span>
                        <p className="text-lg font-black italic tracking-tight">₹{booking.totalAmount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-6 pb-6 pt-2">
                    {booking.status === "CONFIRMED" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() =>
                            navigate(`/booking-success/${booking.id}`)
                          }
                          className="py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center justify-center gap-2"
                        >
                          Details <CheckCircle2Icon className="w-3.5 h-3.5 text-green-500" />
                        </button>
                        <button
                          onClick={() => generateTicketPDF(booking)}
                          className="py-2.5 bg-primary hover:bg-primary-dull rounded-lg text-[10px] font-bold uppercase transition-colors text-white flex items-center justify-center gap-2"
                        >
                          Ticket <TicketIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : isExpired ? (
                      <button
                        onClick={() => navigate(`/movies/${movie.id}`)}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase transition-colors text-red-500 border border-red-500/20"
                      >
                        Rebook Movie
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/checkout/${booking.id}`)}
                        className="w-full py-3 bg-primary hover:bg-primary-dull rounded-lg text-xs font-bold uppercase tracking-widest transition-colors text-white"
                      >
                        Complete Payment
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
