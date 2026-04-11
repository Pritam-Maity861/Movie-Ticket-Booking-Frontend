import { useQuery } from "@tanstack/react-query";
import {
  getShowtimesApi,
  getShowtimeByIdApi,
} from "../services/api/showtime-ep";

export const useShowtimes = (movieId: string, date: string) => {
  return useQuery({
    queryKey: ["showtimes", movieId, date],
    queryFn: () => getShowtimesApi(movieId, date),
    enabled: !!movieId && !!date,
  });
};

export const useShowtimeById = (id: string) => {
  return useQuery({
    queryKey: ["showtime", id],
    queryFn: () => getShowtimeByIdApi(id),
    enabled: !!id,
  });
};
