import { useQuery } from "@tanstack/react-query";
import { httpService } from "../services/http-service";
import { getAllBookings } from "../services/api/booking-ep";

export const getBookingById = async (id: string) => {
  const response = await httpService.get(`/booking/${id}`);
  return response.data;
};

export const useBookingById = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
    refetchInterval: 60 * 1000, // Refetch every minute to stay sync
  });
};

export const useFetchAllBookings = () => {
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: getAllBookings,
  });
};
