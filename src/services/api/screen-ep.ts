import { httpService } from "../http-service";

export interface CreateScreenPayload {
  name: string;
  theaterId: string;
  rows: string[];
  seatsPerRow: number;
}

export interface Seat {
  id: string;
  screenId: string;
  row: string;
  number: number;
  type: string;
}

export interface ScreenRes {
  id: string;
  name: string;
  theaterId: string;
  totalSeats: number;
  createdAt: string;
  seats: Seat[];
}

export const addScreenApi = async (
  payload: CreateScreenPayload,
): Promise<ScreenRes> => {
  const response = await httpService.post("/screen/create-screen", payload);
  console.log(response);
  return response.data.data;
};

export const getScreensApi = async (
  theaterId?: string,
): Promise<ScreenRes[]> => {
  const response = await httpService.get("/screen/screens", {
    params: { theaterId },
  });
  console.log(response);
  return response.data.data;
};

export const deleteScreenApi = async (id: string): Promise<any> => {
  const response = await httpService.delete(`/screen/delete-screen/${id}`);
  return response.data;
};
