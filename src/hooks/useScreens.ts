import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addScreenApi,
  deleteScreenApi,
  getScreensApi,
} from "../services/api/screen-ep";

export const useGetScreens = (theaterId?: string) => {
  return useQuery({
    queryKey: ["getScreens", theaterId],
    queryFn: () => getScreensApi(theaterId),
  });
};

export const useAddNewScreen = (theaterId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addScreenApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getScreens", theaterId] });
    },
  });
};

export const useDeleteScreen = (theaterId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteScreenApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getScreens", theaterId] });
    },
  });
};
