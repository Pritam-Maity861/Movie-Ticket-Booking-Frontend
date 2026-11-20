import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getShowtimesApi,
  getShowtimeByIdApi,
  type CreateShowTimePayload,
  createShowtimeApi,
  getShowtimesByScreenIdApi,
  deleteShowtimeApi,
} from "../services/api/showtime-ep";

export const useShowtimes = (
  movieId: string,
  date: string,
  theaterId?: string,
) => {
  return useQuery({
    queryKey: ["showtimes", movieId, date, theaterId],
    queryFn: () => getShowtimesApi(movieId, date, theaterId),
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

export const useCreateShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateShowTimePayload) => createShowtimeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
};

export const useShowtimesByScreenId = (screenId: string) => {
  return useQuery({
    queryKey: ["showtimes", "screen", screenId],
    queryFn: () => getShowtimesByScreenIdApi(screenId),
    enabled: !!screenId,
  });
};

export const useDeleteShowtime = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShowtimeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      toast.success("Showtime deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete showtime");
    },
  });
};
