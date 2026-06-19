import { axiosCore } from "./api";

export interface ApiUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: { id: number; name: string };
  hospital?: { id: number; name: string; code: string };
  fleetId?: string;
  availabilityStatus?: string;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roleId: number;
  hospitalId?: number;
  fleetId?: string;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  roleId?: number;
  hospitalId?: number;
  fleetId?: string;
}

export const getUsersApi = () => axiosCore.get<ApiUser[]>("/users");
export const getUserByIdApi = (id: number) => axiosCore.get<ApiUser>(`/users/${id}`);
export const createUserApi = (payload: CreateUserPayload) =>
  axiosCore.post<ApiUser>("/users", payload);
export const updateUserApi = (id: number, payload: UpdateUserPayload) =>
  axiosCore.put<ApiUser>(`/users/${id}`, payload);
export const toggleUserActiveApi = (id: number) =>
  axiosCore.patch<ApiUser>(`/users/${id}/toggle-active`);
export const changePasswordApi = (id: number, newPassword: string) =>
  axiosCore.patch(`/users/${id}/change-password`, { newPassword });
