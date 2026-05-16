import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createGenreApi,
  createLanguageApi,
  deleteGenreApi,
  deleteLanguageApi,
  getGenresApi,
  getLanguagesApi,
  updateGenreApi,
  updateLanguageApi,
  getMoviesApi,
  createMovieApi,
  updateMovieApi,
  deleteMovieApi,
  getMovieById,
  getAllMovieWithoutPagination,
} from "../services/api/movie-ep";
import toast from "react-hot-toast";

export const useGenres = () => {
  return useQuery({
    queryKey: ["getGenres"],
    queryFn: getGenresApi,
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGenreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGenres"] });
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGenreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGenres"] });
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGenreApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGenres"] });
    },
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: ["getLanguages"],
    queryFn: getLanguagesApi,
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLanguageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLanguages"] });
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLanguageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLanguages"] });
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLanguageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLanguages"] });
    },
  });
};

export const useMovies = () => {
  return useInfiniteQuery({
    queryKey: ["getMovies"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getMoviesApi(pageParam),

    getNextPageParam: (lastPage, allPage) => {
      return lastPage.hasMore ? allPage.length + 1 : undefined;
    },
  });
};

export const useMoviesWithoutPagination = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["getMoviesWithoutPagination"],
    queryFn: getAllMovieWithoutPagination,
    enabled: enabled,
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMovieApi,
    onSuccess: (response: any) => {
      toast.success(response.message || "Movie created successfully");
      queryClient.invalidateQueries({
        queryKey: ["getMovies", "getMoviesWithoutPagination"],
      });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors;  
      if (validationErrors && Array.isArray(validationErrors)) {
        toast.error(`${validationErrors[0].path[0]}: ${validationErrors[0].message}`);
      } else {
        const serverMsg = error.response?.data?.message;
        toast.error(serverMsg || "An unexpected error occurred");
      }
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMovieApi,
    onSuccess: (response: any) => {
      toast.success(response.message || "Movie updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors; 
      if (validationErrors && Array.isArray(validationErrors)) {
        toast.error(`${validationErrors[0].path[0]}: ${validationErrors[0].message}`);
      } else {
        const serverMsg = error.response?.data?.message;
        toast.error(serverMsg || "An unexpected error occurred");
      }
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMovieApi(id),
    onSuccess: (response: any) => {
      toast.success(response.message || "Movie deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },
    onError: (error: any) => {
      const validationErrors = error.response?.data?.errors; 
      if (validationErrors && Array.isArray(validationErrors)) {
        toast.error(`${validationErrors[0].path[0]}: ${validationErrors[0].message}`);
      } else {
        const serverMsg = error.response?.data?.message;
        toast.error(serverMsg || "An unexpected error occurred");
      }
    },
  });
};

export const useMovieById = (id: string) => {
  return useQuery({
    queryKey: ["getMovieById", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};
