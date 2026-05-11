import axios from "axios";
import { httpService } from "../http-service";
import type { Role } from "../../store/auth-store";
export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface loginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

export interface RegisterResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

export const loginApi = async (
  data: LoginData,
): Promise<{ data: loginResponse }> => {
  const response = await httpService.post("/auth/signin", data);
  return { data: response.data.data };
};

export const registerApi = async (
  data: RegisterData,
): Promise<{ data: RegisterResponse }> => {
  const response = await httpService.post("/auth/signup", data);
  return { data: response.data.data };
};

export const logOutApi = async () => {
  await httpService.post("/auth/logout");
};
export const logOutAllDevicesApi = async () => {
  await httpService.post("/auth/logout-all-devices");
};

/**
 * @returns new access token and user data
 * @description refreshApi uses plai axios just to avoied the interceptor which will cause infinite loop because when we call refresh token api and if the access token is expired then it will call refresh token api again and again until it get new access token or refresh token is expired
 */
export const refreshTokenApi = async () => {
  const res = await axios.post(
    `${
      import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"
    }/auth/refresh`,
    {},
    {
      withCredentials: true,
    },
  );

  return res.data;
};
export const updateProfileApi = async (data: FormData) => {
  const response = await httpService.patch("/auth/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
