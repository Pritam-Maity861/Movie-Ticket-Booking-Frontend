import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
} from "../services/api/movie-ep";

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
    initialPageParam:1,
    queryFn: ({pageParam=1})=>getMoviesApi(pageParam),  

    getNextPageParam:(lastPage,allPage)=>{
      return lastPage.hasMore ? allPage.length+1:undefined
    }
  });
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMovieApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMovieApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id:string)=>deleteMovieApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMovies"] });
    },
  });
};


export const useMovieById=(id:string)=>{
  return useQuery({
    queryKey:["getMovieById",id],
    queryFn:()=>getMovieById(id),
    enabled:!!id,
  })
}