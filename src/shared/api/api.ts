import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../features/auth/store/authStore";

export const axiosCore = axios.create({
  baseURL: "/gesap/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export const axiosAuditor = axios.create({
  baseURL: "/gesap-auditor/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

axiosCore.interceptors.request.use(attachToken);
axiosAuditor.interceptors.request.use(attachToken);

const handle401 = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = "/";
  }
  return Promise.reject(error);
};

axiosCore.interceptors.response.use((r) => r, handle401);
axiosAuditor.interceptors.response.use((r) => r, handle401);
