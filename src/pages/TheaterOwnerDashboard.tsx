import React, { useState } from "react";
import {
  Building2,
  Plus,
  Monitor,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import {
  useMyTheaters,
  useMyRequests,
  useRegisterTheater,
  useCreateScreenRequest,
  useCreateShowtimeRequest,
} from "../hooks/useApprovals";
import { useMoviesWithoutPagination } from "../hooks/useMovie";
import LoaderAnimation from "../components/LoaderAnimation";
import { useAuthStore } from "../store/auth-store";
import type { OwnedTheater, ApprovalStatus } from "../services/api/approval-ep";

const AVAILABLE_AMENITIES = [
  "IMAX",
  "Dolby Atmos",
  "4DX",
  "Laser Projection",
  "Recliners",
  "Food & Beverages",
  "Valet Parking",
  "Wheelchair Accessible",
];

const TheaterOwnerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"THEATERS" | "REQUESTS">("THEATERS");

  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [selectedTheaterForAction, setSelectedTheaterForAction] = useState<OwnedTheater | null>(null);

  // Form states - Theater Registration
  const [theaterName, setTheaterName] = useState("");
  const [theaterCity, setTheaterCity] = useState("");
  const [theaterAddress, setTheaterAddress] = useState("");
  const [theaterRating, setTheaterRating] = useState("4.5");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(["Dolby Atmos"]);

  // Form states - Screen Creation
  const [screenName, setScreenName] = useState("");
  const [screenRowCount, setScreenRowCount] = useState("10");
  const [screenSeatsPerRow, setScreenSeatsPerRow] = useState("10");

  // Form states - Showtime Creation
  const [showtimeScreenId, setShowtimeScreenId] = useState("");
  const [showtimeMovieId, setShowtimeMovieId] = useState("");
  const [showtimeStartTime, setShowtimeStartTime] = useState("");
  const [showtimeEndTime, setShowtimeEndTime] = useState("");
  const [regularPrice, setRegularPrice] = useState("150");
  const [premiumPrice, setPremiumPrice] = useState("250");
  const [vipPrice, setVipPrice] = useState("400");

  // Queries
  const { data: theaters, isLoading: theatersLoading } = useMyTheaters();
  const { data: requests, isLoading: requestsLoading } = useMyRequests();
  const { data: movies } = useMoviesWithoutPagination(isShowtimeModalOpen);

  // Mutations
  const registerTheaterMutation = useRegisterTheater();
  const createScreenMutation = useCreateScreenRequest();
  const createShowtimeMutation = useCreateShowtimeRequest();

  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity],
    );
  };

  // Submit Theater Registration
  const handleRegisterTheaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theaterName || !theaterCity || !theaterAddress) return;

    registerTheaterMutation.mutate(
      {
        name: theaterName,
        city: theaterCity,
        address: theaterAddress,
        amenities: selectedAmenities,
        rating: parseFloat(theaterRating) || 4.5,
      },
      {
        onSuccess: () => {
          setIsRegisterModalOpen(false);
          setTheaterName("");
          setTheaterCity("");
          setTheaterAddress("");
          setSelectedAmenities(["Dolby Atmos"]);
        },
      },
    );
  };

  // Submit Screen Creation
  const handleCreateScreenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTheaterForAction || !screenName) return;

    const parsedRows = Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26));
    const parsedSeatsPerRow = Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50));
    const rowLetters = Array.from({ length: parsedRows }, (_, i) =>
      String.fromCharCode(65 + i),
    );
    const totalSeats = parsedRows * parsedSeatsPerRow;

    createScreenMutation.mutate(
      {
        theaterId: selectedTheaterForAction.id,
        payload: {
          name: screenName,
          totalSeats,
          rows: rowLetters,
          seatsPerRow: parsedSeatsPerRow,
        },
      },
      {
        onSuccess: () => {
          setIsScreenModalOpen(false);
          setScreenName("");
          setScreenRowCount("10");
          setScreenSeatsPerRow("10");
          setSelectedTheaterForAction(null);
        },
      },
    );
  };

  // Submit Showtime Creation
  const handleCreateShowtimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showtimeScreenId || !showtimeMovieId || !showtimeStartTime || !showtimeEndTime) {
      return;
    }

    createShowtimeMutation.mutate(
      {
        screenId: showtimeScreenId,
        movieId: showtimeMovieId,
        startTime: new Date(showtimeStartTime).toISOString(),
        endTime: new Date(showtimeEndTime).toISOString(),
        regularSeatPrice: parseFloat(regularPrice) || 150,
        premiumSeatPrice: parseFloat(premiumPrice) || 250,
        vipSeatPrice: parseFloat(vipPrice) || 400,
      },
      {
        onSuccess: () => {
          setIsShowtimeModalOpen(false);
          setShowtimeScreenId("");
          setShowtimeMovieId("");
          setShowtimeStartTime("");
          setShowtimeEndTime("");
          setSelectedTheaterForAction(null);
        },
      },
    );
  };

  // Status badge helper
  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved & Live
          </span>
        );
      case "REJECTED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Under Admin Review
          </span>
        );
    }
  };

  const pendingRequestsCount =
    requests?.filter((r) => r.status === "PENDING").length || 0;
  const approvedTheatersCount =
    theaters?.filter((t) => t.status === "APPROVED").length || 0;
  const totalScreensCount =
    theaters?.reduce((acc, t) => acc + (t.screens?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#09090b] text-white pt-24 pb-16 px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Background glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Theater Owner Portal
              </span>
              <span className="text-xs text-gray-500">• Maker-Checker Workflow</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Welcome, {user?.name || "Cinema Owner"}
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Register new cinema properties, configure auditoriums, and schedule movie screenings. All submissions are verified by administrators before going live.
            </p>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold rounded-2xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Register New Theater
          </button>
        </div>

        {/* Quick KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Registered Theaters
            </div>
            <div className="text-3xl font-black text-white">
              {theaters?.length || 0}
            </div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> {approvedTheatersCount} live in catalog
            </div>
          </div>

          <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Active Screens
            </div>
            <div className="text-3xl font-black text-white">
              {totalScreensCount}
            </div>
            <div className="text-xs text-gray-500 mt-1">Across all properties</div>
          </div>

          <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Pending Admin Reviews
            </div>
            <div className="text-3xl font-black text-amber-400">
              {pendingRequestsCount}
            </div>
            <div className="text-xs text-amber-500/80 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Awaiting approval
            </div>
          </div>

          <div className="bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
              Total Submissions
            </div>
            <div className="text-3xl font-black text-white">
              {requests?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">Audit log count</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("THEATERS")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "THEATERS"
                ? "bg-white/10 text-white border border-white/20 shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            My Theaters ({theaters?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("REQUESTS")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "REQUESTS"
                ? "bg-white/10 text-white border border-white/20 shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ClipboardList className="w-4 h-4 text-amber-400" />
            Approval Requests ({requests?.length || 0})
            {pendingRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: THEATERS */}
        {activeTab === "THEATERS" && (
          <div>
            {theatersLoading ? (
              <div className="flex justify-center items-center py-24">
                <LoaderAnimation />
              </div>
            ) : theaters?.length === 0 ? (
              <div className="p-16 text-center text-gray-400 bg-[#121216] rounded-3xl border border-white/10 space-y-4">
                <Building2 className="w-16 h-16 mx-auto opacity-30 text-amber-400" />
                <h3 className="text-xl font-bold text-white">No Theaters Registered Yet</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  You haven't submitted any theaters yet. Click the button below to register your first theater property and send it for Admin approval.
                </p>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-xl transition cursor-pointer text-sm"
                >
                  Register Your Cinema
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {theaters?.map((theater) => (
                  <div
                    key={theater.id}
                    className="bg-[#121216] border border-white/10 rounded-3xl p-6 shadow-xl space-y-5 hover:border-white/20 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {theater.name}
                        </h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          {theater.city} • {theater.address}
                        </p>
                      </div>
                      <div>{getStatusBadge(theater.status)}</div>
                    </div>

                    {/* Amenities Badges */}
                    {theater.amenities && theater.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {theater.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Screens summary */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-amber-400" />
                          Auditoriums ({theater.screens?.length || 0})
                        </span>
                        <button
                          onClick={() => {
                            setSelectedTheaterForAction(theater);
                            setIsScreenModalOpen(true);
                          }}
                          className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1 text-xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Screen
                        </button>
                      </div>

                      {theater.screens && theater.screens.length > 0 ? (
                        <div className="space-y-2">
                          {theater.screens.map((screen) => (
                            <div
                              key={screen.id}
                              className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs"
                            >
                              <div>
                                <span className="font-semibold text-white">
                                  {screen.name}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  ({screen.totalSeats} seats)
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedTheaterForAction(theater);
                                  setShowtimeScreenId(screen.id);
                                  setIsShowtimeModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black font-bold transition cursor-pointer text-[11px]"
                              >
                                + Showtime
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500 italic py-2">
                          No screens added yet. Click "+ Add Screen" to submit auditorium setup.
                        </div>
                      )}
                    </div>

                    {theater.status === "PENDING" && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                        This theater is currently awaiting administrator review. Once approved, its showtimes will go live to all moviegoers and AI assistants.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUESTS & AUDIT LOG */}
        {activeTab === "REQUESTS" && (
          <div>
            {requestsLoading ? (
              <div className="flex justify-center items-center py-24">
                <LoaderAnimation />
              </div>
            ) : requests?.length === 0 ? (
              <div className="p-16 text-center text-gray-400 bg-[#121216] rounded-3xl border border-white/10">
                <ClipboardList className="w-12 h-12 mx-auto opacity-30 text-gray-400 mb-2" />
                <p className="text-sm font-semibold">No requests submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests?.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#121216] border border-white/10 rounded-2xl p-5 shadow-lg space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                          {req.targetType.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          ID: {req.id.slice(0, 8)}...
                        </span>
                        <span className="text-xs text-gray-400">
                          • Submitted on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold">Target Entity: </span>
                        <span className="text-white">
                          {req.theater?.name || req.payload?.name || "Cinema Request"}
                        </span>
                      </div>

                      {req.reviewedBy && (
                        <div>
                          <span className="text-gray-400 font-semibold">Reviewed By: </span>
                          <span className="text-white">
                            {req.reviewedBy.name} on{" "}
                            {req.reviewedAt
                              ? new Date(req.reviewedAt).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>

                    {req.adminFeedback && (
                      <div
                        className={`p-3 rounded-xl border text-xs ${
                          req.status === "REJECTED"
                            ? "bg-red-500/10 border-red-500/30 text-red-300"
                            : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        }`}
                      >
                        <span className="font-bold">Admin Feedback: </span>
                        "{req.adminFeedback}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: REGISTER THEATER */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                Register New Theater
              </h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterTheaterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                  Theater / Cinema Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CineStar IMAX Palladium"
                  value={theaterName}
                  onChange={(e) => setTheaterName(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={theaterCity}
                    onChange={(e) => setTheaterCity(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Initial Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={theaterRating}
                    onChange={(e) => setTheaterRating(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                  Address & Landmark *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4th Floor, High Street Phoenix, Lower Parel"
                  value={theaterAddress}
                  onChange={(e) => setTheaterAddress(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold uppercase tracking-wider block mb-2">
                  Cinema Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                            : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:text-white font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registerTheaterMutation.isPending}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold rounded-xl transition cursor-pointer"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SCREEN */}
      {isScreenModalOpen && selectedTheaterForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Monitor className="w-5 h-5 text-amber-400" />
                Add Screen to {selectedTheaterForAction.name}
              </h3>
              <button
                onClick={() => setIsScreenModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScreenSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                  Screen / Auditorium Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Audi 1 - Dolby Atmos"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Rows (1 - 26) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="26"
                    value={screenRowCount}
                    onChange={(e) => setScreenRowCount(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Rows A - {String.fromCharCode(64 + Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)))}
                  </span>
                </div>

                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Seats Per Row *
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="50"
                    value={screenSeatsPerRow}
                    onChange={(e) => setScreenSeatsPerRow(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Columns 1 - {Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50))}
                  </span>
                </div>
              </div>

              {/* Capacity & Category Preview */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5 text-gray-400">
                <div className="flex justify-between text-white font-bold pb-1 border-b border-white/5">
                  <span>Total Calculated Capacity:</span>
                  <span className="text-amber-400">
                    {(Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26))) *
                      (Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50)))}{" "}
                    Seats
                  </span>
                </div>
                <div className="text-[11px] flex justify-between">
                  <span>
                    Rows A - {String.fromCharCode(Math.min(66, 64 + Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26))))} (Premium):
                  </span>
                  <span className="text-amber-300">
                    {Math.min(2, Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26))) *
                      (Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50)))}{" "}
                    seats
                  </span>
                </div>
                {Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)) > 2 && (
                  <div className="text-[11px] flex justify-between">
                    <span>
                      Rows C - {String.fromCharCode(Math.min(69, 64 + Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26))))} (VIP):
                    </span>
                    <span className="text-purple-300">
                      {Math.max(0, Math.min(3, Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)) - 2)) *
                        (Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50)))}{" "}
                      seats
                    </span>
                  </div>
                )}
                {Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)) > 5 && (
                  <div className="text-[11px] flex justify-between">
                    <span>
                      Rows F - {String.fromCharCode(64 + Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)))} (Regular):
                    </span>
                    <span className="text-blue-300">
                      {(Math.max(1, Math.min(parseInt(screenRowCount, 10) || 10, 26)) - 5) *
                        (Math.max(1, Math.min(parseInt(screenSeatsPerRow, 10) || 10, 50)))}{" "}
                      seats
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsScreenModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createScreenMutation.isPending}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold rounded-xl transition cursor-pointer"
                >
                  Submit Screen Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SCHEDULE SHOWTIME */}
      {isShowtimeModalOpen && selectedTheaterForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Schedule Showtime ({selectedTheaterForAction.name})
              </h3>
              <button
                onClick={() => setIsShowtimeModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShowtimeSubmit} className="space-y-4 text-xs">
              {/* Select Movie */}
              <div>
                <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                  Select Movie *
                </label>
                <select
                  value={showtimeMovieId}
                  onChange={(e) => setShowtimeMovieId(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                  required
                >
                  <option value="" className="bg-[#121216] text-gray-400">
                    -- Choose Movie from Catalog --
                  </option>
                  {movies?.map((m: any) => (
                    <option key={m.id} value={m.id} className="bg-[#121216] text-white">
                      {m.title} ({m.duration} mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={showtimeStartTime}
                    onChange={(e) => setShowtimeStartTime(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={showtimeEndTime}
                    onChange={(e) => setShowtimeEndTime(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              {/* Seat Pricing */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Regular (₹)
                  </label>
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    Premium (₹)
                  </label>
                  <input
                    type="number"
                    value={premiumPrice}
                    onChange={(e) => setPremiumPrice(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold uppercase tracking-wider block mb-1">
                    VIP (₹)
                  </label>
                  <input
                    type="number"
                    value={vipPrice}
                    onChange={(e) => setVipPrice(e.target.value)}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-amber-400 transition"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsShowtimeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 hover:text-white font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createShowtimeMutation.isPending}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold rounded-xl transition cursor-pointer"
                >
                  Submit Showtime Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterOwnerDashboard;

