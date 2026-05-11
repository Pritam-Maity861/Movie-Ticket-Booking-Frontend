import { httpService } from "../http-service";

export const getAdminStats = async () => {
  const response = await httpService.get("/admin/stats");
  return response.data;
};
export const getAllUsers = async () => {
  const response = await httpService.get("/admin/users");
  return response.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const response = await httpService.patch("/admin/users/role", {
    userId,
    role,
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await httpService.delete(`/admin/users/${id}`);
  return response.data;
};
