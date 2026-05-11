import { Calendar, Clock, List, MapPin, User, Wallet } from "lucide-react";
import LoaderAnimation from "../../components/LoaderAnimation";
import { useFetchAllBookings } from "../../hooks/useBooking";

const BookingsManager = () => {
  const { data, isLoading, isError } = useFetchAllBookings();
  const bookingsData = data?.data;

  return (
    <div className="p-4 w-full">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-wide">
        Bookings Management
      </h1>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm">
        <p className="text-gray-400 mb-5">
          Manage and track all movie bookings here.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-125">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <List className="text-primary" size={20} />
              Booking List
            </h2>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <LoaderAnimation />
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-20">
              <p className="text-red-400">
                Error fetching bookings. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !isError && bookingsData?.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No bookings found.
            </div>
          )}

          <div className="space-y-4">
            {bookingsData?.map((booking: any) => (
              <div
                key={booking.id}
                className="p-4 md:p-6 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 shadow-xl relative overflow-hidden group flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between w-full"
              >
                {/* Movie & Poster Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full lg:w-auto min-w-[250px]">
                  <div className="relative w-24 h-32 shrink-0">
                    <img
                      src={booking.showtime.movie.posterUrl}
                      alt={booking.showtime.movie.title}
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-primary text-xl font-bold mb-1">
                      {booking.showtime.movie.title}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-white/60 text-sm mb-1">
                      <Calendar size={14} />
                      {new Date(
                        booking.showtime.startTime,
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-white/60 text-sm">
                      <Clock size={14} />
                      {new Date(booking.showtime.startTime).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" },
                      )}
                    </div>
                  </div>
                </div>

                {/* Theater & Screen Details */}
                <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
                  <h4 className="text-white text-lg font-semibold flex items-center gap-2 mb-1">
                    <MapPin size={16} className="text-primary" />
                    Venue Details
                  </h4>
                  <p className="text-white/70 text-sm">
                    <span className="text-primary/80 font-medium">
                      Theater:
                    </span>{" "}
                    {booking.showtime.screen.theater.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    <span className="text-primary/80 font-medium">Screen:</span>{" "}
                    {booking.showtime.screen.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    <span className="text-primary/80 font-medium">Seats:</span>{" "}
                    {booking.seats
                      .map((s: any) => `${s.seat.row}${s.seat.number}`)
                      .join(", ")}
                  </p>
                </div>

                {/* User Info */}
                <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                  <h4 className="text-white text-lg font-semibold flex items-center gap-2 mb-1">
                    <User size={16} className="text-primary" />
                    Customer Details
                  </h4>
                  <p className="text-white/70 text-sm">
                    <span className="text-primary/80 font-medium">Name:</span>{" "}
                    {booking.user.name}
                  </p>
                  <p className="text-white/70 text-sm break-all">
                    <span className="text-primary/80 font-medium">Email:</span>{" "}
                    {booking.user.email}
                  </p>
                  <p className="text-white/70 text-sm">
                    <span className="text-primary/80 font-medium">
                      Booking ID:
                    </span>{" "}
                    <span className="font-mono text-xs text-white/40">
                      {booking.id}
                    </span>
                  </p>
                </div>

                {/* Payment Status & Amount */}
                <div className="flex flex-col gap-4 w-full lg:w-48 items-center lg:items-end justify-center border-t lg:border-t-0 pt-4 lg:pt-0">
                  <div className="text-right">
                    <div className="text-white/60 text-xs text-center lg:text-right mb-1">
                      Total Amount
                    </div>
                    <div className="text-2xl font-bold text-white flex items-center gap-1">
                      <Wallet size={20} className="text-primary" />₹
                      {booking.totalAmount}
                    </div>
                  </div>

                  <div className="w-full lg:w-auto">
                    <span
                      className={`
                      block text-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider
                      ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : booking.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }
                    `}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsManager;
