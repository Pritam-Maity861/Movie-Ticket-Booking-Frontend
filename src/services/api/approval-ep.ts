import { httpService } from "../http-service";

export const ApprovalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const ApprovalTargetType = {
  REGISTER_THEATER: "REGISTER_THEATER",
  UPDATE_THEATER: "UPDATE_THEATER",
  CREATE_SCREEN: "CREATE_SCREEN",
  UPDATE_SCREEN: "UPDATE_SCREEN",
  DELETE_SCREEN: "DELETE_SCREEN",
  CREATE_SHOWTIME: "CREATE_SHOWTIME",
  DELETE_SHOWTIME: "DELETE_SHOWTIME",
} as const;
export type ApprovalTargetType = (typeof ApprovalTargetType)[keyof typeof ApprovalTargetType];

export interface ApprovalRequestItem {
  id: string;
  ownerId: string;
  theaterId?: string;
  targetType: ApprovalTargetType;
  targetId?: string;
  payload: any;
  status: ApprovalStatus;
  adminFeedback?: string;
  reviewedById?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  theater?: {
    id: string;
    name: string;
    city: string;
    address: string;
    rating?: number;
    ratting?: number;
    amenities?: string[];
    status: ApprovalStatus;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  reviewedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OwnedTheater {
  id: string;
  name: string;
  city: string;
  address: string;
  rating?: number;
  ratting?: number;
  amenities: string[];
  status: ApprovalStatus;
  ownerId: string;
  createdAt: string;
  screens: {
    id: string;
    name: string;
    totalSeats: number;
    seats?: any[];
  }[];
}

// -------------------------------------------------------------
// THEATER OWNER APIS
// -------------------------------------------------------------

export interface RegisterTheaterPayload {
  name: string;
  city: string;
  address: string;
  amenities?: string[];
  rating?: number;
}

export const registerTheaterApi = async (
  payload: RegisterTheaterPayload,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.post("/theater-owner/theaters", payload);
  return res.data.data;
};

export const updateTheaterOwnerApi = async (
  id: string,
  payload: Partial<RegisterTheaterPayload>,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.patch(`/theater-owner/theaters/${id}`, payload);
  return res.data.data;
};

export const getMyTheatersApi = async (): Promise<OwnedTheater[]> => {
  const res = await httpService.get("/theater-owner/my-theaters");
  return res.data.data;
};

export const getMyRequestsApi = async (): Promise<ApprovalRequestItem[]> => {
  const res = await httpService.get("/theater-owner/my-requests");
  return res.data.data;
};

export const getRequestDetailsApi = async (
  id: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.get(`/theater-owner/my-requests/${id}`);
  return res.data.data;
};

export interface CreateScreenRequestPayload {
  name: string;
  totalSeats: number;
  rows?: string[];
  seatsPerRow?: number;
  seats?: { row: string; number: number; type: string }[];
}

export const createScreenRequestApi = async (
  theaterId: string,
  payload: CreateScreenRequestPayload,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.post(
    `/theater-owner/theaters/${theaterId}/screens`,
    payload,
  );
  return res.data.data;
};

export const updateScreenRequestApi = async (
  screenId: string,
  payload: { name?: string; totalSeats?: number },
): Promise<ApprovalRequestItem> => {
  const res = await httpService.patch(
    `/theater-owner/screens/${screenId}`,
    payload,
  );
  return res.data.data;
};

export const deleteScreenRequestApi = async (
  screenId: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.delete(`/theater-owner/screens/${screenId}`);
  return res.data.data;
};

export interface CreateShowtimeRequestPayload {
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  regularSeatPrice?: number;
  premiumSeatPrice?: number;
  vipSeatPrice?: number;
}

export const createShowtimeRequestApi = async (
  payload: CreateShowtimeRequestPayload,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.post("/theater-owner/showtimes", payload);
  return res.data.data;
};

export const deleteShowtimeRequestApi = async (
  showtimeId: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.delete(`/theater-owner/showtimes/${showtimeId}`);
  return res.data.data;
};

// -------------------------------------------------------------
// ADMIN APPROVAL APIS
// -------------------------------------------------------------

export const getAdminApprovalsApi = async (params?: {
  status?: ApprovalStatus;
  targetType?: ApprovalTargetType;
}): Promise<ApprovalRequestItem[]> => {
  const res = await httpService.get("/admin/approvals", { params });
  return res.data.data;
};

export const getAdminApprovalByIdApi = async (
  id: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.get(`/admin/approvals/${id}`);
  return res.data.data;
};

export const approveRequestApi = async (
  id: string,
  feedback?: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.patch(`/admin/approvals/${id}/approve`, {
    feedback,
  });
  return res.data.data;
};

export const rejectRequestApi = async (
  id: string,
  feedback: string,
): Promise<ApprovalRequestItem> => {
  const res = await httpService.patch(`/admin/approvals/${id}/reject`, {
    feedback,
  });
  return res.data.data;
};

