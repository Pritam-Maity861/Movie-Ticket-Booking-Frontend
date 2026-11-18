import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShowtimeById } from "../hooks/useShowtime";
import {
  ChevronLeftIcon,
  InfoIcon,
  TicketIcon,
  ShoppingBagIcon,
  LockIcon,
} from "lucide-react";
import LoaderAnimation from "../components/LoaderAnimation";
import BlurBackground from "../components/BlurBackground";
import { assets } from "../assets/assets";
import { createPendingBooking } from "../services/api/booking-ep";
import toast from "react-hot-toast";

const SeatLayout = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const {
    data: showtime,
    isLoading,
    isError,
  } = useShowtimeById(showtimeId as string);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Group seats by row
  const groupedSeats = useMemo(() => {
    if (!showtime?.screen?.seats) return {};
    const groups: Record<string, any[]> = {};
    showtime.screen.seats.forEach((seat: any) => {
      if (!groups[seat.row]) groups[seat.row] = [];
      groups[seat.row].push(seat);
    });
    return groups;
  }, [showtime]);

  // Check if seat is permanently booked (confirmed in DB)
  const isSeatBooked = (seatId: string) => {
    if (showtime?.bookedSeatIds?.includes(seatId)) return true;
    return showtime?.bookingSeats?.some((bs: any) => {
      return bs.seatId === seatId && bs.booking?.status === "CONFIRMED";
    });
  };

  // Check if seat is temporarily locked (in checkout hold via Redis or DB pending)
  const isSeatLocked = (seatId: string) => {
    if (isSeatBooked(seatId)) return false;
    if (showtime?.lockedSeatIds?.includes(seatId)) return true;
    return showtime?.bookingSeats?.some((bs: any) => {
      if (bs.seatId !== seatId) return false;
      if (bs.booking?.status === "PENDING") {
        return new Date(bs.booking.expiresAt) > new Date();
      }
      return false;
    });
  };

  // Get seat price
  const getSeatPrice = (type: string) => {
    return (
      showtime?.seatPricings?.find((p: any) => p.seatType === type)?.price || 0
    );
  };

  const toggleSeatSelection = (seatId: string) => {
    if (isSeatBooked(seatId)) {
      toast.error("This seat is already booked.");
      return;
    }
    if (isSeatLocked(seatId)) {
      toast("This seat is temporarily locked in checkout by another user.", {
        icon: "🔒",
      });
      return;
    }
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = showtime?.screen?.seats?.find((s: any) => s.id === seatId);
      return total + getSeatPrice(seat?.type);
    }, 0);
  }, [selectedSeats, showtime]);

  const selectedSeatDetails = useMemo(() => {
    return selectedSeats
      .map((id) => showtime?.screen?.seats?.find((s: any) => s.id === id))
      .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number);
  }, [selectedSeats, showtime]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderAnimation />
      </div>
    );
  }

  if (isError || !showtime) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center">
          <InfoIcon className="w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-xl font-bold">Failed to load seat layout</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-primary font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-32 text-white bg-black relative overflow-x-hidden">
      <BlurBackground top="0%" left="0%" />
      <BlurBackground bottom="0%" right="0%" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 z-10 relative">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 animate-fade-in pt-4 md:pt-0">
          <button
            onClick={() => navigate(-1)}
            className="p-2 md:p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg md:rounded-2xl transition-colors cursor-pointer"
          >
            <ChevronLeftIcon className="w-4 h-4 md:w-6 md:h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl md:text-3xl font-black truncate leading-tight">
              {showtime.movie.title}
            </h1>
            <p className="text-gray-500 text-[10px] md:text-base font-bold flex items-center gap-1.5 md:gap-2">
              <span className="truncate max-w-[120px] md:max-w-none">
                {showtime.screen.theater.name}
              </span>{" "}
              |{" "}
              {new Date(showtime.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div
          className="flex flex-wrap justify-center gap-3 md:gap-8 mb-8 md:mb-12 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          {[
            { label: "Available", color: "bg-white/5 border border-white/20" },
            { label: "Selected", color: "bg-primary border border-primary" },
            {
              label: "Locked (In Checkout)",
              color: "bg-amber-500/20 border border-amber-500/60 text-amber-400",
              icon: <LockIcon className="w-2 md:w-3 h-2 md:h-3 text-amber-400" />,
            },
            {
              label: "Booked (Sold)",
              color: "bg-zinc-900 border border-zinc-800 text-zinc-600",
              dot: true,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-3.5 h-3.5 md:w-5 md:h-5 rounded-sm md:rounded ${item.color} flex items-center justify-center`}
              >
                {item.icon ? (
                  item.icon
                ) : item.dot ? (
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-zinc-600 rounded-full"></div>
                ) : null}
              </div>
              <span className="text-[10px] md:text-xs font-bold text-gray-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Screen Indicator */}
        <div
          className="relative mb-12 md:mb-20 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="w-full max-w-[280px] md:max-w-2xl mx-auto h-1.5 md:h-2 bg-primary/30 rounded-full blur-xl absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2"></div>
          <div className="w-full max-w-[320px] md:max-w-2xl mx-auto text-center px-4 md:px-10">
            <img
              src={assets.screenImage}
              alt="Screen"
              className="w-full opacity-60 pointer-events-none"
            />
            <p className="text-[7px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.5em] text-gray-600 mt-1 md:mt-2 uppercase">
              All eyes this way
            </p>
          </div>
        </div>

        {/* Seat Grid */}
        <div
          className="flex flex-col gap-3 md:gap-8 mb-24 px-4 md:p-0 items-center overflow-x-auto pb-10 scrollbar-hide animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          {Object.entries(groupedSeats).map(([row, seats]) => (
            <div
              key={row}
              className="flex items-center gap-4 md:gap-6 min-w-max"
            >
              <span className="w-4 md:w-6 text-[10px] md:text-sm font-black text-gray-500 text-center">
                {row}
              </span>
              <div className="flex gap-1.5 md:gap-3 pt-1">
                {seats.map((seat) => {
                  const selected = selectedSeats.includes(seat.id);
                  const booked = isSeatBooked(seat.id);
                  const locked = isSeatLocked(seat.id);
                  const isDisabled = booked || locked;

                  return (
                    <button
                      key={seat.id}
                      disabled={isDisabled}
                      onClick={() => toggleSeatSelection(seat.id)}
                      title={
                        booked
                          ? `Seat ${row}${seat.number} - Booked (Sold)`
                          : locked
                            ? `Seat ${row}${seat.number} - Locked (Checkout in progress)`
                            : selected
                              ? `Seat ${row}${seat.number} - Selected (₹${getSeatPrice(seat.type)})`
                              : `Seat ${row}${seat.number} - Available (₹${getSeatPrice(seat.type)})`
                      }
                      className={`
                        w-6 h-6 md:w-10 md:h-10 rounded md:rounded-xl flex items-center justify-center transition-all duration-300 relative group cursor-pointer
                        ${
                          booked
                            ? "bg-zinc-900 border border-zinc-800/80 text-zinc-600 cursor-not-allowed opacity-60"
                            : locked
                              ? "bg-amber-500/15 border border-amber-500/40 text-amber-400 cursor-not-allowed shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                              : selected
                                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110 border border-primary"
                                : "bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 hover:scale-105 text-white"
                        }
                      `}
                    >
                      {booked ? (
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-zinc-600 rounded-full"></div>
                      ) : locked ? (
                        <LockIcon className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-amber-400" />
                      ) : (
                        <span
                          className={`text-[7px] md:text-[10px] font-bold ${selected ? "opacity-100" : "opacity-80 group-hover:opacity-100"}`}
                        >
                          {seat.number}
                        </span>
                      )}

                      {/* Seat Type Indicator (Subtle dot at top for available seats) */}
                      {!isDisabled && !selected && (
                        <div
                          className={`absolute -top-0.5 md:-top-1 right-1/2 translate-x-1/2 w-0.5 md:w-1 h-0.5 md:h-1 rounded-full 
                          ${seat.type === "VIP" ? "bg-yellow-500" : seat.type === "PREMIUM" ? "bg-blue-500" : "bg-transparent"}`}
                        ></div>
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="w-4 md:w-6 text-[10px] md:text-sm font-black text-gray-500 text-center">
                {row}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Info */}
        <div className="max-w-md mx-auto flex justify-between gap-1 mb-24 px-4 text-[7px] md:text-[10px] font-black uppercase tracking-wider md:tracking-widest text-gray-600">
          {[
            { type: "VIP", color: "bg-yellow-500" },
            { type: "PREMIUM", color: "bg-blue-500" },
            { type: "REGULAR", color: "bg-gray-700" },
          ].map((pricing) => (
            <div
              key={pricing.type}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 border border-white/5"
            >
              <div
                className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${pricing.color}`}
              ></div>{" "}
              {pricing.type}: ₹{getSeatPrice(pricing.type)}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Summary Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 transform ${selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Mobile Backdrop Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl md:hidden"></div>

        <div className="bg-black/90 md:bg-black/80 backdrop-blur-3xl border-t border-white/10 px-4 py-4 md:px-12 md:py-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="flex-1 w-full md:w-auto overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-2 md:mb-3 pb-1">
                {selectedSeatDetails.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-2.5 md:px-3 py-0.5 md:py-1 bg-primary/10 border border-primary/20 rounded-full text-[9px] md:text-xs font-black text-primary whitespace-nowrap"
                  >
                    {seat.row}
                    {seat.number}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between md:justify-start gap-4">
                <p className="text-gray-500 text-[9px] md:text-xs font-bold uppercase tracking-widest md:tracking-widest flex items-center gap-2">
                  <TicketIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />{" "}
                  {selectedSeats.length} Ticket
                  {selectedSeats.length > 1 ? "s" : ""}
                </p>
                <div className="md:hidden text-right">
                  <h4 className="text-xl font-black text-primary leading-none">
                    ₹{totalPrice}
                  </h4>
                  <p className="text-[7px] text-gray-600 font-bold uppercase mt-1">
                    Total Payable
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 w-full md:w-auto border-t border-white/5 md:border-0 pt-4 md:pt-0">
              <div className="hidden md:block text-right">
                <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Total Payable
                </p>
                <h4 className="text-3xl font-black text-primary">
                  ₹{totalPrice}
                </h4>
              </div>
              <button
                className="flex-1 md:flex-none w-full md:w-[240px] px-8 py-3.5 md:py-5 bg-primary hover:bg-primary-dull text-white rounded-xl md:rounded-2xl font-black flex items-center justify-center gap-2 md:gap-3 shadow-xl md:shadow-2xl shadow-primary/30 transition-all active:scale-95 cursor-pointer text-sm md:text-base uppercase tracking-widest"
                onClick={async () => {
                  try {
                    setIsProcessing(true);
                    const response = await createPendingBooking({
                      showtimeId: showtimeId as string,
                      seatIds: selectedSeats,
                    });

                    toast.success("Seats locked! Proceeding to checkout...");
                    navigate(`/checkout/${response.data.id}`);
                  } catch (error: any) {
                    console.error("Booking failed:", error);
                    toast.error(
                      error.response?.data?.message ||
                        "Failed to lock seats. Please try again.",
                    );
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                disabled={isProcessing}
              >
                {isProcessing ? "PROCESSING..." : "PROCEED"}
                {!isProcessing && (
                  <ShoppingBagIcon className="w-4 h-4 md:w-5 md:h-5 " />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
