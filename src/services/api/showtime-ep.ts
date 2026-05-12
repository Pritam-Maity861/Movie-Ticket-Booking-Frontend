import { httpService } from "../http-service";

export interface Showtime {
  showtimeId: string;
  startTime: string;
  endTime: string;
}

export interface Screen {
  screenId: string;
  screenName: string;
  showtimes: Showtime[];
}

export interface TheaterShowtimes {
  theaterId: string;
  theaterName: string;
  address: string;
  city: string;
  ratting: string;
  screens: Screen[];
}

export interface ShowtimeDetail {
  id: string;
  movieId: string;
  screenId: string;
  startTime: string;
  endTime: string;
  movie: {
    id: string;
    title: string;
    posterUrl?: string;
  };
}

export interface CreateShowTimePayload {
  screenId: string;
  movieId: string;
  startTime: string;
  vipSeatPrice: number;
  premiumSeatPrice: number;
  regularSeatPrice: number;
}

export const getShowtimesApi = async (
  movieId: string,
  date: string,
): Promise<TheaterShowtimes[]> => {
  const res = await httpService.post("/showtime/get-showtimes", {
    movieId,
    date,
  });
  return res.data.data;
};

export const getShowtimeByIdApi = async (id: string): Promise<any> => {
  const res = await httpService.get(`/showtime/get-showtime/${id}`);
  console.log(res.data);
  return res.data.data;
};

export const createShowtimeApi = async (payload: CreateShowTimePayload) => {
  const res = await httpService.post("/showtime/create-showtime", payload);
  console.log(`created showtime data:${res}`);
  return res.data.data;
};

export const getShowtimesByScreenIdApi = async (
  screenId: string,
): Promise<ShowtimeDetail[]> => {
  const res = await httpService.get(
    `/showtime/get-showtimes/screen/${screenId}`,
  );
  return res.data.data;
};

export const deleteShowtimeApi = async (id: string): Promise<void> => {
  await httpService.delete(`/showtime/delete-showtime?id=${id}`);
};
