import { useState } from "react";
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Building2,
  Monitor,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Search,
} from "lucide-react";
import {
  useAdminApprovals,
  useApproveRequest,
  useRejectRequest,
} from "../../hooks/useApprovals";
import LoaderAnimation from "../../components/LoaderAnimation";
import type { ApprovalRequestItem, ApprovalStatus } from "../../services/api/approval-ep";

const ApprovalsManager = () => {
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequestItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);

  const { data: requests, isLoading, isError } = useAdminApprovals(
    statusFilter === "ALL" ? undefined : { status: statusFilter },
  );

  const approveMutation = useApproveRequest();
  const rejectMutation = useRejectRequest();

  const handleApprove = (id: string) => {
    approveMutation.mutate({ id });
  };

  const handleOpenReject = (id: string) => {
    setRejectRequestId(id);
    setRejectFeedback("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectRequestId || !rejectFeedback.trim()) return;
    rejectMutation.mutate(
      { id: rejectRequestId, feedback: rejectFeedback.trim() },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setRejectRequestId(null);
        },
      },
    );
  };

  const filteredRequests = requests?.filter((req) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const theaterName = req.theater?.name?.toLowerCase() || "";
    const ownerName = req.owner?.name?.toLowerCase() || "";
    const ownerEmail = req.owner?.email?.toLowerCase() || "";
    const payloadStr = JSON.stringify(req.payload).toLowerCase();
    return (
      theaterName.includes(query) ||
      ownerName.includes(query) ||
      ownerEmail.includes(query) ||
      payloadStr.includes(query)
    );
  });

  const getTargetTypeBadge = (targetType: string) => {
    switch (targetType) {
      case "REGISTER_THEATER":
        return { label: "Register Theater", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: <Building2 className="w-3.5 h-3.5" /> };
      case "UPDATE_THEATER":
        return { label: "Update Theater", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30", icon: <Building2 className="w-3.5 h-3.5" /> };
      case "CREATE_SCREEN":
        return { label: "Add Screen", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: <Monitor className="w-3.5 h-3.5" /> };
      case "UPDATE_SCREEN":
        return { label: "Update Screen", color: "bg-purple-500/20 text-purple-400 border-purple-500/30", icon: <Monitor className="w-3.5 h-3.5" /> };
      case "DELETE_SCREEN":
        return { label: "Delete Screen", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: <Monitor className="w-3.5 h-3.5" /> };
      case "CREATE_SHOWTIME":
        return { label: "New Showtime", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: <Calendar className="w-3.5 h-3.5" /> };
      case "DELETE_SHOWTIME":
        return { label: "Delete Showtime", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: <Calendar className="w-3.5 h-3.5" /> };
      default:
        return { label: targetType, color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: <Sparkles className="w-3.5 h-3.5" /> };
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5" /> Approved
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
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="text-primary w-8 h-8" />
            Theater Owner Approvals
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Review and approve or reject theater registrations, screens, and showtime schedules submitted by cinema owners.
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "PENDING", label: "Pending" },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
            { id: "ALL", label: "All Requests" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cinema or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-primary transition"
          />
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <LoaderAnimation />
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-red-400 bg-red-500/10 rounded-2xl border border-red-500/20">
          Failed to load approval requests. Please check your admin privileges.
        </div>
      ) : filteredRequests?.length === 0 ? (
        <div className="p-16 text-center text-gray-400 bg-white/5 rounded-2xl border border-white/10">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-300" />
          <p className="text-base font-semibold">No requests found</p>
          <p className="text-xs text-gray-500 mt-1">
            {statusFilter === "PENDING"
              ? "All clear! There are no pending requests awaiting review."
              : "No approval requests match the current filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests?.map((req) => {
            const typeInfo = getTargetTypeBadge(req.targetType);
            return (
              <div
                key={req.id}
                className="bg-[#121216] border border-white/10 rounded-2xl p-5 md:p-6 hover:border-white/20 transition-all duration-300 shadow-xl space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${typeInfo.color}`}
                    >
                      {typeInfo.icon}
                      {typeInfo.label}
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

                {/* Content Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {/* Theater Info */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-primary" /> Cinema
                    </div>
                    <div className="font-bold text-white text-base truncate">
                      {req.theater?.name || req.payload?.name || "New Cinema"}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                      {req.theater?.city || req.payload?.city || "Unknown City"} -{" "}
                      {req.theater?.address || req.payload?.address || ""}
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" /> Submitting Owner
                    </div>
                    <div className="font-bold text-white truncate">
                      {req.owner?.name || "Theater Owner"}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {req.owner?.email || "owner@cinema.com"}
                    </div>
                  </div>

                  {/* Action / Feedback summary */}
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                    <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      Request Details
                    </div>
                    {req.targetType === "REGISTER_THEATER" && (
                      <div className="text-xs text-gray-300">
                        Amenities: {req.payload?.amenities?.join(", ") || "Standard"}
                      </div>
                    )}
                    {req.targetType === "CREATE_SCREEN" && (
                      <div className="text-xs text-gray-300">
                        Screen: {req.payload?.name} ({req.payload?.totalSeats} seats)
                      </div>
                    )}
                    {req.targetType === "CREATE_SHOWTIME" && (
                      <div className="text-xs text-gray-300">
                        Start: {new Date(req.payload?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Price: ₹{req.payload?.regularSeatPrice || 150}
                      </div>
                    )}
                    {req.adminFeedback && (
                      <div className="text-xs text-amber-300 mt-1 italic">
                        Feedback: "{req.adminFeedback}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setIsDetailModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Payload
                  </button>

                  {req.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReject(req.id)}
                        disabled={rejectMutation.isPending || approveMutation.isPending}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve & Publish
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal with mandatory feedback */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Reject Approval Request
            </h3>
            <p className="text-xs text-gray-400">
              Please provide constructive feedback explaining to the theater owner why their request is rejected so they can revise and re-submit.
            </p>
            <textarea
              rows={4}
              placeholder="e.g. Address verification failed, please provide valid trade license or correct ticket pricing."
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-red-500 transition resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectFeedback.trim() || rejectMutation.isPending}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Payload Modal */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Request Payload & Audit Log
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-semibold">Target Type: </span>
                <span className="text-white font-mono">{selectedRequest.targetType}</span>
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Status: </span>
                <span className="text-white font-mono">{selectedRequest.status}</span>
              </div>
              <div>
                <span className="text-gray-400 font-semibold">Submitted By: </span>
                <span className="text-white">{selectedRequest.owner?.name} ({selectedRequest.owner?.email})</span>
              </div>
              {selectedRequest.reviewedBy && (
                <div>
                  <span className="text-gray-400 font-semibold">Reviewed By: </span>
                  <span className="text-white">{selectedRequest.reviewedBy.name} ({selectedRequest.reviewedBy.email})</span>
                </div>
              )}
              {selectedRequest.adminFeedback && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300">
                  <span className="font-bold">Admin Feedback: </span>
                  {selectedRequest.adminFeedback}
                </div>
              )}

              <div>
                <div className="text-gray-400 font-semibold mb-1">Proposed Payload JSON:</div>
                <pre className="p-4 bg-black/50 border border-white/5 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-60">
                  {JSON.stringify(selectedRequest.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalsManager;

