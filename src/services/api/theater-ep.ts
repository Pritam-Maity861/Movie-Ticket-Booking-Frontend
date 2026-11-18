import { httpService } from "../http-service";

export interface CreateTheaterPayload {
  name: string;
  city: string;
  address: string;
  ratting?: number | null;
}

export interface TheaterRes {
  id: string;
  name: string;
  city: string;
  address: string;
  ratting: number | null;
  createdAt: string;
  updatedAt: string;
}

export const addTheaterApi = async (
  payload: CreateTheaterPayload,
): Promise<TheaterRes> => {
  const response = await httpService.post("/theaters/add-theater", payload);
  return response.data.data;
};

export const getTheaterApi = async (): Promise<TheaterRes[]> => {
  const response = await httpService.get("/theaters");
  return response.data.data;
};

export const updateTheaterApi = async (
  id: string,
  payload: Partial<CreateTheaterPayload>,
): Promise<TheaterRes> => {
  const response = await httpService.patch(`/theaters/${id}`, payload);
  return response.data.data;
};

export const deleteTheaterApi = async (id: string): Promise<void> => {
  await httpService.delete(`/theaters/${id}`);
};
