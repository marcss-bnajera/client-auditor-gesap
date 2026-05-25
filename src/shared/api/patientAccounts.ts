import { axiosAuditor } from "./api";

export type AccountStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface PatientAccount {
  id: number;
  dpi: string;
  email: string;
  status: AccountStatus;
  createdAt: string;
  approvedBy?: { id: number; firstName: string; lastName: string };
}

export const getPendingAccountsApi = () =>
  axiosAuditor.get<PatientAccount[]>("/patient-accounts/pending");

export const getAllAccountsApi = () =>
  axiosAuditor.get<PatientAccount[]>("/patient-accounts");

export const approveAccountApi = (id: number) =>
  axiosAuditor.patch<PatientAccount>(`/patient-accounts/${id}/approve`);

export const rejectAccountApi = (id: number) =>
  axiosAuditor.patch<PatientAccount>(`/patient-accounts/${id}/reject`);
