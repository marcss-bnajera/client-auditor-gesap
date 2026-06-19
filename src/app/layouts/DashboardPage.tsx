import React, { useEffect, useState } from "react";
import {
  FiAlertCircle, FiUsers, FiCheckCircle,
  FiHardDrive, FiCalendar, FiActivity, FiLoader,
} from "react-icons/fi";
import { useAuthStore } from "../../features/auth/store/authStore";
import { getDashboardStatsApi, type DashboardStats } from "../../shared/api/dashboard";
import toast from "react-hot-toast";

interface KpiCard {
  label: string;
  key: keyof DashboardStats;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}

const kpiCards: KpiCard[] = [
  { label: "Emergencias activas",     key: "activeEmergencies",      icon: FiAlertCircle, color: "#ef4444" },
  { label: "Cuentas pendientes",      key: "pendingAccounts",         icon: FiCheckCircle, color: "#f59e0b" },
  { label: "Total de usuarios",       key: "totalUsers",              icon: FiUsers,       color: "#0E6BA8" },
  { label: "Hospitales activos",      key: "totalHospitals",          icon: FiHardDrive,   color: "#00ACC1" },
  { label: "Total pacientes",         key: "totalPatients",           icon: FiUsers,       color: "#26A69A" },
  { label: "Sin identificar",         key: "unidentifiedPatients",    icon: FiAlertCircle, color: "#8b5cf6" },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const dateStr = new Date().toLocaleDateString("es-GT", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    getDashboardStatsApi()
      .then((r) => setStats(r.data))
      .catch((err: unknown) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status !== 401) {
          toast.error("No se pudieron cargar las estadísticas del dashboard");
        }
        setStats({});
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-7 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] tracking-tight">
            Bienvenido, {user?.firstName ?? "Auditor"}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {user?.role === "SUPER_AUDITOR"
              ? "Vista global — todos los hospitales del sistema"
              : "Vista de tu hospital asignado"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-2 text-sm text-slate-600 shadow-sm">
          <FiCalendar size={16} className="text-[#00ACC1]" />
          <span className="capitalize font-medium hidden md:block">{dateStr}</span>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpiCards.map((card) => {
            const value = stats?.[card.key];
            if (value === undefined) return null;
            return (
              <div
                key={card.key as string}
                className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${card.color}, #0A2647)` }}
                  >
                    <card.icon size={20} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-[#0A2647] leading-tight">
                  {value as number}
                </p>
                <p className="text-sm text-slate-500 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Banner */}
      <div className="bg-[#0A2647] rounded-2xl p-5 text-white flex items-center gap-4 shadow-lg">
        <div className="bg-white/10 p-2.5 rounded-xl shrink-0">
          <FiActivity size={20} className="text-blue-300" />
        </div>
        <div>
          <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-0.5">Recordatorio</p>
          <p className="text-sm font-medium">
            Revisa periódicamente las cuentas pendientes de pacientes y los registros de auditoría del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};
