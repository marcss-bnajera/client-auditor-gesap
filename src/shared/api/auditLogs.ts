import { axiosAuditor } from "./api";

export interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entityId?: number;
  ipAddress?: string;
  createdAt: string;
  user?: { id: number; firstName: string; lastName: string; email: string };
  hospital?: { id: number; name: string };
}

export interface AuditSummaryItem {
  action: string;
  entity: string;
  count: number;
}

export interface AuditFilters {
  userId?: number;
  action?: string;
  entity?: string;
  from?: string;
  to?: string;
}

export const getAuditLogsApi = (filters?: AuditFilters) =>
  axiosAuditor.get<AuditLog[]>("/audit-logs", { params: filters });

export const getAuditSummaryApi = () =>
  axiosAuditor.get<AuditSummaryItem[]>("/audit-logs/summary");
