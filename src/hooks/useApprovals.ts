import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type ApprovalStatus,
  type ApprovalTargetType,
  type CreateScreenRequestPayload,
  type CreateShowtimeRequestPayload,
  type RegisterTheaterPayload,
  approveRequestApi,
  createScreenRequestApi,
  createShowtimeRequestApi,
  deleteScreenRequestApi,
  deleteShowtimeRequestApi,
  getAdminApprovalByIdApi,
  getAdminApprovalsApi,
  getMyRequestsApi,
  getMyTheatersApi,
  registerTheaterApi,
  rejectRequestApi,
  updateTheaterOwnerApi,
} from "../services/api/approval-ep";
import toast from "react-hot-toast";

// -------------------------------------------------------------
// ADMIN HOOKS (CHECKER)
// -------------------------------------------------------------

export const useAdminApprovals = (params?: {
  status?: ApprovalStatus;
  targetType?: ApprovalTargetType;
}) => {
  return useQuery({
    queryKey: ["admin-approvals", params?.status, params?.targetType],
    queryFn: () => getAdminApprovalsApi(params),
  });
};

export const useAdminApprovalById = (id: string) => {
  return useQuery({
    queryKey: ["admin-approval", id],
    queryFn: () => getAdminApprovalByIdApi(id),
    enabled: !!id,
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback?: string }) =>
      approveRequestApi(id, feedback),
    onSuccess: () => {
      toast.success("Request approved and changes published to catalog!");
      queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
      queryClient.invalidateQueries({ queryKey: ["allTheaters"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to approve request";
      toast.error(msg);
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      rejectRequestApi(id, feedback),
    onSuccess: () => {
      toast.success("Request rejected with feedback.");
      queryClient.invalidateQueries({ queryKey: ["admin-approvals"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Failed to reject request";
      toast.error(msg);
    },
  });
};

// -------------------------------------------------------------
// THEATER OWNER HOOKS (MAKER)
// -------------------------------------------------------------

export const useMyTheaters = () => {
  return useQuery({
    queryKey: ["my-theaters"],
    queryFn: getMyTheatersApi,
  });
};

export const useMyRequests = () => {
  return useQuery({
    queryKey: ["my-requests"],
    queryFn: getMyRequestsApi,
  });
};

export const useRegisterTheater = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterTheaterPayload) => registerTheaterApi(payload),
    onSuccess: () => {
      toast.success("Theater registration submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-theaters"] });
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg);
    },
  });
};

export const useUpdateTheaterOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RegisterTheaterPayload> }) =>
      updateTheaterOwnerApi(id, payload),
    onSuccess: () => {
      toast.success("Theater update request submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Update request failed";
      toast.error(msg);
    },
  });
};

export const useCreateScreenRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      theaterId,
      payload,
    }: {
      theaterId: string;
      payload: CreateScreenRequestPayload;
    }) => createScreenRequestApi(theaterId, payload),
    onSuccess: () => {
      toast.success("Screen creation request submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Screen request failed";
      toast.error(msg);
    },
  });
};

export const useDeleteScreenRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (screenId: string) => deleteScreenRequestApi(screenId),
    onSuccess: () => {
      toast.success("Screen deletion request submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Deletion request failed";
      toast.error(msg);
    },
  });
};

export const useCreateShowtimeRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShowtimeRequestPayload) =>
      createShowtimeRequestApi(payload),
    onSuccess: () => {
      toast.success("Showtime schedule submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Showtime request failed";
      toast.error(msg);
    },
  });
};

export const useDeleteShowtimeRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (showtimeId: string) => deleteShowtimeRequestApi(showtimeId),
    onSuccess: () => {
      toast.success("Showtime deletion request submitted for Admin approval!");
      queryClient.invalidateQueries({ queryKey: ["my-requests"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Showtime deletion request failed";
      toast.error(msg);
    },
  });
};

