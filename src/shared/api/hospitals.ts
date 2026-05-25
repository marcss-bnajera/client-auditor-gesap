import { axiosAuditor } from "./api";

export interface Hospital {
  id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface HospitalPayload {
  name: string;
  code: string;
  address?: string;
  phone?: string;
}

export const getHospitalsApi = () =>
  axiosAuditor.get<Hospital[]>("/hospitals");

export const getActiveHospitalsApi = () =>
  axiosAuditor.get<Hospital[]>("/hospitals/active");

export const getHospitalByIdApi = (id: number) =>
  axiosAuditor.get<Hospital>(`/hospitals/${id}`);

export const createHospitalApi = (payload: HospitalPayload) =>
  axiosAuditor.post<Hospital>("/hospitals", payload);

export const updateHospitalApi = (id: number, payload: HospitalPayload) =>
  axiosAuditor.put<Hospital>(`/hospitals/${id}`, payload);

export const toggleHospitalApi = (id: number) =>
  axiosAuditor.patch<Hospital>(`/hospitals/${id}/toggle`);
