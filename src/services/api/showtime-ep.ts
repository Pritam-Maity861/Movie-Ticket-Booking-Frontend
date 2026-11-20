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
  theaterId?: string,
): Promise<TheaterShowtimes[]> => {
  const params: Record<string, string> = { movieId, date };
  if (theaterId) params.theaterId = theaterId;
  const res = await httpService.get("/showtime", { params });
  return res.data.data;
};

export const getShowtimeByIdApi = async (id: string): Promise<any> => {
  const res = await httpService.get(`/showtime/${id}`);
  return res.data.data;
};

export interface ShowtimeSeat {
  seatId: string;
  row: string;
  number: number;
  type: string;
  price: number;
  status: "AVAILABLE" | "HELD" | "BOOKED";
}

export interface ShowtimeSeatAvailability {
  showtimeId: string;
  movieId: string;
  theaterName: string;
  screenName: string;
  startTime: string;
  endTime: string;
  totalSeats: number;
  availableSeatsCount: number;
  seats: ShowtimeSeat[];
}

export const getShowtimeSeatsApi = async (
  showtimeId: string,
): Promise<ShowtimeSeatAvailability> => {
  const res = await httpService.get(`/showtime/${showtimeId}/seats`);
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
