import { axiosCore } from "./api";

export interface ApiRole {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export const getRolesApi = () => axiosCore.get<ApiRole[]>("/roles");
export const getRoleByIdApi = (id: number) => axiosCore.get<ApiRole>(`/roles/${id}`);
export const createRoleApi = (payload: { name: string; description?: string }) =>
  axiosCore.post<ApiRole>("/roles", payload);
export const updateRoleApi = (id: number, payload: { name?: string; description?: string }) =>
  axiosCore.put<ApiRole>(`/roles/${id}`, payload);
export const deleteRoleApi = (id: number) => axiosCore.delete(`/roles/${id}`);
