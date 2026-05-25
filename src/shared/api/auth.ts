import { axiosCore } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginApi = (payload: LoginPayload) =>
  axiosCore.post<AuthResponse>("/auth/login", payload);
