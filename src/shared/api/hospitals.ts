import { axiosAuditor } from "./api";

export type HospitalLevel =
  | "REFERENCIA_NACIONAL" | "ESPECIALIZADO" | "REGIONAL" | "DEPARTAMENTAL"
  | "DISTRITAL" | "CENTRO_SALUD_A" | "CENTRO_SALUD_B" | "CAP";

export const HOSPITAL_LEVEL_LABELS: Record<HospitalLevel, string> = {
  REFERENCIA_NACIONAL: "Referencia Nacional",
  ESPECIALIZADO:       "Especializado",
  REGIONAL:            "Regional",
  DEPARTAMENTAL:       "Departamental",
  DISTRITAL:           "Distrital",
  CENTRO_SALUD_A:      "Centro de Salud A",
  CENTRO_SALUD_B:      "Centro de Salud B",
  CAP:                 "CAP",
};

export interface Hospital {
  id:           number;
  code:         string;
  name:         string;
  level:        HospitalLevel;
  department:   string;
  municipality: string;
  address?:     string;
  phone?:       string;
  isActive:     boolean;
  createdAt:    string;
}

export interface HospitalPayload {
  code:         string;
  name:         string;
  level:        HospitalLevel;
  department:   string;
  municipality: string;
  address?:     string;
  phone?:       string;
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
