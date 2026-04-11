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
  address:string;
  city:string;
  ratting:string
  screens: Screen[];
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
