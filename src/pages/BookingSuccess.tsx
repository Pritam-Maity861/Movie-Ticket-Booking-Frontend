import { useParams, useNavigate } from "react-router-dom";
import { useBookingById } from "../hooks/useBooking";
import {
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TicketIcon,
  HomeIcon,
} from "lucide-react";
import LoaderAnimation from "../components/LoaderAnimation";
import BlurBackground from "../components/BlurBackground";
import { generateTicketPDF } from "../utils/generateTicket";

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
  } = useBookingById(bookingId as string);

  const booking = response?.data;

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderAnimation />
      </div>
    );
  }

  // Error or not found
  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-lg font-bold">Booking not found</p>
      </div>
    );
  }

  const { showtime, seats, totalAmount, status } = booking;
  const { movie, screen } = showtime;
  const { theater } = screen;

  //  If not confirmed
  if (status !== "CONFIRMED") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black text-center px-6">
        <div>
          <p className="text-xl font-bold mb-4">
            Payment is still processing...
          </p>
          <button
            onClick={() => navigate(`/checkout/${bookingId}`)}
            className="px-6 py-3 bg-primary rounded-xl font-bold"
          >
            Go Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#09090b] text-white relative overflow-hidden">
      <BlurBackground top="-10%" left="-10%" />
      <BlurBackground bottom="-10%" right="-10%" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-12 animate-in fade-in zoom-in duration-700">
          <div className="relative inline-block">
            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full -z-10 animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black mb-3 tracking-tighter">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-400 text-lg font-medium max-w-md mx-auto">
            Get ready for an amazing cinematic experience. Your tickets are
            ready!
          </p>
        </div>

        {/*  Ticket Card */}
        <div className="bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r "></div>

          <div className="p-8 md:p-12">
            {/* Movie Info */}
            <div className="flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-48 h-72 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 transform hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter mb-4 text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400">
                    {movie.title}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                      Confirmed
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Digital Ticket
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          Location
                        </p>
                        <p className="font-bold text-sm">{theater.name}</p>
                        <p className="text-xs text-gray-400">
                          {" "}
                          {theater.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <TicketIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          Screen
                        </p>
                        <p className="font-bold text-sm">{screen.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          Date
                        </p>
                        <p className="font-bold text-sm">
                          {new Date(showtime.startTime).toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <ClockIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                          Time
                        </p>
                        <p className="font-bold text-sm">
                          {new Date(showtime.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mb-4">
                Selected Seats
              </p>
              <div className="flex flex-wrap gap-3">
                {seats.map((item: any) => (
                  <div
                    key={item.id}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:border-primary/50 transition-colors group"
                  >
                    <span className="text-primary group-hover:animate-pulse mr-1">
                      ●
                    </span>
                    {item.seat.row}
                    {item.seat.number}
                  </div>
                ))}
              </div>
            </div>

            {/* Price and Booking ID */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mt-12 pt-10 border-t border-dashed border-white/20">
              <div className="relative">
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Booking ID
                </p>
                <p className="font-mono text-xl text-white/80 tracking-widest bg-white/5 px-4 py-2 rounded-xl inline-block border border-white/5">
                  {booking.id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Total Investment
                </p>
                <div className="flex items-baseline justify-end gap-2">
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    ₹{totalAmount}
                  </p>
                  <span className="text-green-500 text-[10px] font-black uppercase bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 items-center justify-center">
          <button
            onClick={() => generateTicketPDF(booking)}
            className="w-full md:w-auto px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-4xl font-black tracking-widest text-xs uppercase transition-all shadow-xl shadow-green-500/20 active:scale-95 flex items-center justify-center gap-3 group cursor-pointer"
          >
            <TicketIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Download Ticket PDF
          </button>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate("/my-bookings")}
              className="px-5 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-4xl font-black text-sm transition-all items-center justify-center gap-2 cursor-pointer"
            >
              My Bookings
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-5 bg-primary hover:bg-primary-dull text-white rounded-4xl font-black transition-all cursor-pointer active:scale-95"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
