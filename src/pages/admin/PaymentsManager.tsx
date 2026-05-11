import { List, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import LoaderAnimation from "../../components/LoaderAnimation";
import { useFetchAllPayments } from "../../hooks/usePayments";

const PaymentsManager = () => {
  const { data: paymentsData, isLoading, isError } = useFetchAllPayments();

  return (
    <div className="p-4 w-full">
      <h1 className="text-3xl font-bold mb-6 text-white tracking-wide">
        Payments Management
      </h1>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm">
        <p className="text-gray-400 mb-5">
          Track and manage all financial transactions.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group min-h-125">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors duration-500"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <List className="text-primary" size={20} />
              Payment List
            </h2>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <LoaderAnimation />
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center py-20">
              <p className="text-rose-400">Error fetching payments</p>
            </div>
          )}

          <div className="space-y-4">
            {paymentsData?.map((payment, index) => (
              <div
                key={payment.id || index}
                className="p-4 border border-white/10 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 shadow-xl relative overflow-hidden group flex flex-col md:flex-row gap-6 items-center md:items-start justify-between w-full"
              >
                {/* Movie Info */}
                <div className="flex flex-col items-center md:items-start gap-3 min-w-[160px]">
                  <img
                    src={payment.posterUrl}
                    alt={payment.movieTitle}
                    className="h-32 w-24 object-cover rounded-xl shadow-md"
                  />
                  <h3 className="text-primary text-lg font-bold text-center md:text-left">
                    {payment?.movieTitle}
                  </h3>
                </div>

                {/* Theater Info */}
                <div className="flex flex-col gap-2 flex-1 w-full text-center md:text-left">
                  <h4 className="text-white text-lg font-semibold flex items-center justify-center md:justify-start gap-2">
                    <MapPin size={16} className="text-primary" />
                    Theater
                  </h4>
                  <p className="text-white/60 text-sm">
                    <span className="text-primary/70 font-medium">Name:</span>{" "}
                    {payment?.theaterName}
                  </p>
                  <p className="text-white/60 text-sm">
                    <span className="text-primary/70 font-medium">Time:</span>{" "}
                    {new Date(payment?.showtime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Payment Detail */}
                <div className="flex flex-col gap-2 flex-1 w-full text-center md:text-left">
                  <h4 className="text-white text-lg font-semibold flex items-center justify-center md:justify-start gap-2">
                    <User size={16} className="text-primary" />
                    User
                  </h4>
                  <p className="text-white/60 text-sm">
                    <span className="text-primary/70 font-medium">Name:</span>{" "}
                    {payment?.username}
                  </p>
                  <p className="text-white/60 text-sm break-all">
                    <span className="text-primary/70 font-medium">Email:</span>{" "}
                    {payment?.userEmail}
                  </p>
                  <p className="text-white/60 text-sm">
                    <span className="text-primary/70 font-medium">Amount:</span>{" "}
                    <span className="text-white font-bold">
                      ₹{payment?.amount}
                    </span>
                  </p>
                </div>

                {/* Status Column */}
                <div className="flex flex-col gap-3 min-w-[140px] items-center md:items-end w-full md:w-auto">
                  <div className="text-right w-full">
                    <h4 className="text-white text-sm font-semibold mb-2 text-center md:text-right">
                      Booking Status
                    </h4>
                    <span
                      className={`
                      flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider w-full
                      ${
                        payment.bookingStatus === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }
                    `}
                    >
                      {payment.bookingStatus === "CONFIRMED" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {payment.bookingStatus}
                    </span>
                  </div>
                  <div className="text-right w-full">
                    <h4 className="text-white text-sm font-semibold mb-2 text-center md:text-right">
                      Payment Status
                    </h4>
                    <span
                      className={`
                      block text-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider w-full
                      ${
                        payment.status === "SUCCESS"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : payment.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      }
                    `}
                    >
                      {payment.status}
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

export default PaymentsManager;
