import { httpService } from "../http-service";

export const createOrder = async (bookingId: string) => {
  const res = await httpService.post("/payments/create-order", { bookingId });
  return res.data.data;
};

export const verifyPayment = async (payload: any) => {
  return httpService.post("/payments/verify", payload);
};