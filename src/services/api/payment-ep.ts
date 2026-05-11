import { httpService } from "../http-service";



export interface PaymentListResponse {
  id: string;

  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED"|"REFUNDED";
  provider: "RAZORPAY" | "STRIPE" | "PAYPAL";

  createdAt: string;

  movieTitle: string;
  posterUrl: string;

  showtime: string;     
  theaterName: string;
  city: string;

  username:string,
  userEmail:string,

  

  bookingStatus: "CONFIRMED" | "PENDING" | "EXPIRED"|"CANCELLED";
}

export const createOrder = async (bookingId: string) => {
  const res = await httpService.post("/payments/create-order", { bookingId });
  return res.data.data;
};

export const verifyPayment = async (payload: any) => {
  return httpService.post("/payments/verify", payload);
};


export const getAllPayments = async ():Promise<PaymentListResponse[]> => {
  const res = await httpService.get("/payments/get-all-payments");
  console.log(res)
  return res.data.data;
}