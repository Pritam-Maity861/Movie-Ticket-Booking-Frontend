import { httpService } from "../http-service";

export interface genreRes {
  id: string;
  name: string;
  createdAt: string;
}

export interface languageRes {
  id: string;
  name: string;
  createdAt: string;
}

export interface Credit {
  id: string;
  movieId: string;
  personId: string;
  role: "ACTOR" | "DIRECTOR" | "PRODUCER"; 
  characterName: string;
  billingOrder: number | null;
  createdAt: string;
  updatedAt: string;

  person: Person;
}

export interface CreateMoviePayload {
  title: string;
  description: string;
  releaseDate: string;
  genreIds: string[];
  languageIds: string[];
  duration: number;
  trailerUrl: string;
  rating: number;
  credits: Credit[];
}

export interface Language {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieRes {
  id: string;
  title: string;
  description: string;
  duration: number;
  trailerUrl: string;
  releaseDate: string; // ISO string
  posterUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;

  languages: Language[];
  genres: Genre[];
  credits: Credit[];
}

export interface MoviesPaginatedRes {
  movies: MovieRes[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export const getGenresApi = async (): Promise<genreRes[]> => {
  const res = await httpService.get("/movie/get-genre");
  return res.data.data;
};

export const createGenreApi = async (name: string): Promise<genreRes> => {
  const res = await httpService.post("/movie/add-genre", { name });
  return res.data.data;
};

export const updateGenreApi = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<genreRes> => {
  const res = await httpService.patch(`/movie/update-genre/${id}`, { name });
  return res.data.data;
};

export const deleteGenreApi = async (id: string): Promise<void> => {
  await httpService.delete(`/movie/delete-genre/${id}`);
};

export const getLanguagesApi = async (): Promise<languageRes[]> => {
  const res = await httpService.get("/movie/get-language");
  return res.data.data;
};

export const createLanguageApi = async (name: string): Promise<languageRes> => {
  const res = await httpService.post("/movie/add-language", { name });
  return res.data.data;
};

export const updateLanguageApi = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}): Promise<languageRes> => {
  const res = await httpService.patch(`/movie/update-language/${id}`, { name });
  return res.data.data;
};

export const deleteLanguageApi = async (id: string): Promise<void> => {
  await httpService.delete(`/movie/delete-language/${id}`);
};

export const getMoviesApi = async (pageParam:number): Promise<MoviesPaginatedRes> => {
  const res = await httpService.get(`/movie/get-all-movie?page=${pageParam}&limit=10`);
  return res.data.data;
};

export const createMovieApi = async (
  movieData: FormData,
): Promise<MovieRes> => {
  const res = await httpService.post("/movie/add-movie", movieData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export const updateMovieApi = async ({
  id,
  movieData,
}: {
  id: string;
  movieData: FormData;
}): Promise<MovieRes> => {
  const res = await httpService.patch(`/movie/update-movie/${id}`, movieData);
  return res.data.data;
};

export const deleteMovieApi = async (id: string): Promise<void> => {
  await httpService.delete(`/movie/delete-movie/${id}`);
};


export const getMovieById=async (id:string):Promise<MovieRes>=>{
  const res=await httpService.get(`movie/get-movie/${id}`);
  console.log(res);
  return res.data.data;
}

// get all movie without pagination
export const getAllMovieWithoutPagination=async ():Promise<MovieRes[]>=>{
  const res=await httpService.get(`movie/get-all/`);
  console.log(res);
  return res.data.data;
}
