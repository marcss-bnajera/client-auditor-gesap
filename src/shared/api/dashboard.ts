import { axiosAuditor } from "./api";

export interface DashboardStats {
  activeEmergencies?: number;
  totalUsers?: number;
  pendingAccounts?: number;
  totalHospitals?: number;
  totalPatients?: number;
  unidentifiedPatients?: number;
  receptionistAvailability?: number;
  [key: string]: number | string | undefined;
}

export const getDashboardStatsApi = () =>
  axiosAuditor.get<DashboardStats>("/dashboard/stats");
