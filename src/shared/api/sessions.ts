import { axiosAuditor } from "./api";

export interface ActiveSession {
  id:           number;
  userId:       number;
  userName:     string;
  userEmail:    string;
  roleName:     string;
  hospital?:    { id: number; name: string; code: string } | null;
  ipAddress?:   string | null;
  userAgent?:   string | null;
  loginAt:      string;
  lastActiveAt: string;
  isActive:     boolean;
}

export type SessionHistory = ActiveSession; // misma forma, todos los estados

export interface SessionHistoryFilters {
  from?: string;
  to?: string;
  isActive?: boolean;
}

export const getActiveSessionsApi = () =>
  axiosAuditor.get<ActiveSession[]>("/sessions/active");

export const getSessionsHistoryApi = (filters?: SessionHistoryFilters) =>
  axiosAuditor.get<SessionHistory[]>("/sessions/history", { params: filters });

export const kickSessionApi = (sessionId: number) =>
  axiosAuditor.post<{ message: string }>(`/sessions/kick/${sessionId}`);
