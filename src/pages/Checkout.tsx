import { useParams, useNavigate } from "react-router-dom";
import { useBookingById } from "../hooks/useBooking";
import {
  ChevronLeftIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  TicketIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
} from "lucide-react";
import LoaderAnimation from "../components/LoaderAnimation";
import BlurBackground from "../components/BlurBackground";
import CheckoutTimer from "../components/CheckoutTimer";
import toast from "react-hot-toast";
import { useState } from "react";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import { createOrder, verifyPayment } from "../services/api/payment-ep";

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    data: response,
    isLoading,
    isError,
  } = useBookingById(bookingId as string);
  const booking = response?.data;

  const handleExpire = () => {
    toast.error(
      "Your booking session has expired. Please select seats again.",
      {
        id: "booking-expired", // Prevent multiple toasts
      }
    );
    // Redirect to movie page or seat layout
    if (booking?.showtime?.movieId) {
      navigate(`/movies/${booking.showtime.movieId}`);
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoaderAnimation />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black p-6">
        <div className="text-center max-w-md">
          <AlertCircleIcon className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-4">Booking Not Found</h1>
          <p className="text-gray-400 mb-8 font-medium">
            We couldn't find the booking you're looking for. It may have been
            cancelled or expired.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const { showtime, seats, totalAmount, status } = booking;
  const { movie, screen } = showtime;
  const { theater } = screen;

  // If already expired according to DB
  if (status === "EXPIRED") {
    handleExpire();
    return null;
  }

  const handlePayment = async () => {
    try {
      setLoading(true);
      //load razorpay script
      const isLoded = await loadRazorpayScript();
      console.log(isLoded)
      if (!isLoded) {
        toast.error("Failed to load payment gateway. Please try again later.");
        return;
      }

      //create order
      console.log("Creating order for bookingId:", bookingId);
      const order = await createOrder(bookingId as string);

      //configure option razorpay
      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,

        name: "Movie Booking",
        description: movie.title,

        handler: async function (response: any) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful 🎉");
            navigate(`/booking-success/${bookingId}`);
          } catch (error) {
            console.error(error);
            toast("Payment verification failed", { position: "top-center" });
          }
        },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled", { icon: "⚠️" });
          },
        },

        prefill: {
          name: "user",
          email: "user@example.com",
        },

        theme: {
          color: "#3399cc",
        },
      };
      
      //open razorpay modal
      const rzp=new (window as any).Razorpay(options);

      if (booking.status !== "PENDING") {
        toast.error("Booking is no longer valid");
        return;
      }
      rzp.on("payment.failed", function () {
        toast.error("Payment failed. Try again.");
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 text-white bg-black relative overflow-x-hidden">
      <BlurBackground top="0%" left="0%" />
      <BlurBackground bottom="0%" right="0%" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 z-10 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors cursor-pointer"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black">Checkout</h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Complete your booking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs hidden sm:block">
              Time remaining
            </p>
            <CheckoutTimer
              expiresAt={booking.expiresAt}
              onExpire={handleExpire}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left Side: Movie & Theater Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Movie Card */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-48 h-72 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-black mb-2">{movie.title}</h2>
                  <p className="text-primary font-black uppercase tracking-widest text-sm">
                    {movie.genres?.map((g: any) => g.name).join(" • ")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPinIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        Theater
                      </p>
                      <p className="font-bold">{theater.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        Date
                      </p>
                      <p className="font-bold">
                        {new Date(showtime.startTime).toLocaleDateString([], {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        Time
                      </p>
                      <p className="font-bold">
                        {new Date(showtime.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <TicketIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">
                        Screen
                      </p>
                      <p className="font-bold">{screen.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                Seats Summary{" "}
                <span className="text-primary">({seats.length})</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {seats.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center group hover:bg-primary/5 hover:border-primary/50 transition-all cursor-default"
                  >
                    <p className="text-2xl font-black text-white group-hover:text-primary transition-colors">
                      {item.seat.row}
                      {item.seat.number}
                    </p>
                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-tighter">
                      {item.seat.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Badges */}
            <div className="flex flex-wrap gap-4 px-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" /> Secure
                Encryption
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" /> Licensed
                Distributor
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary & Payment */}
          <div className="space-y-8">
            <div className="bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 md:p-10 sticky top-32 shadow-2xl shadow-primary/5">
              <h3 className="text-xl font-black mb-8 text-primary uppercase tracking-widest">
                Price Details
              </h3>

              <div className="space-y-4 mb-8">
                {seats.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm font-bold text-gray-300"
                  >
                    <span>
                      Seat {item.seat.row}
                      {item.seat.number} ({item.seat.type})
                    </span>
                    <span className="text-white">
                      ₹
                      {
                        showtime.seatPricings.find(
                          (p: any) => p.seatType === item.seat.type
                        )?.price
                      }
                    </span>
                  </div>
                ))}

                <div className="h-px bg-white/10 my-6"></div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">
                      Grand Total
                    </p>
                    <h4 className="text-4xl font-black text-white">
                      ₹{totalAmount}
                    </h4>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 italic">
                    Incl. all taxes
                  </p>
                </div>
              </div>

              <button
                className="w-full py-5 bg-primary hover:bg-primary-dull text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 transition-all active:scale-95 group overflow-hidden relative cursor-pointer"
                onClick={handlePayment}
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]"></div>
                {loading ? "PROCESSING..." : "MAKE PAYMENT"}
              </button>

              <p className="text-center text-[10px] font-bold text-gray-500 mt-6 leading-relaxed">
                By clicking "Make Payment", you agree to our <br />
                <span className="underline decoration-primary cursor-pointer hover:text-white">
                  Terms & Conditions
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
