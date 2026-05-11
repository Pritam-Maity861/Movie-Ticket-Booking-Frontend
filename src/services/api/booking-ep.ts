import { httpService } from "../http-service";

export const createPendingBooking = async (data: {
  showtimeId: string;
  seatIds: string[];
}) => {
  console.log("data:", data);
  const response = await httpService.post("/booking/pending-booking", data);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await httpService.get("/booking/my-bookings");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await httpService.get("/booking/get-all-bookings");
  return response.data;
};
