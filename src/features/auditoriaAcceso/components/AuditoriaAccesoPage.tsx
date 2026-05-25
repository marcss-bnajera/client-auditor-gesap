import React, { useEffect, useState } from "react";
import {
  FiActivity, FiLoader, FiSearch,
  FiRefreshCw, FiCalendar, FiUser,
} from "react-icons/fi";
import {
  getAuditLogsApi, type AuditLog, type AuditFilters,
} from "../../../shared/api/auditLogs";
import toast from "react-hot-toast";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-600",
  UPDATE: "bg-blue-50 text-blue-600",
  DELETE: "bg-red-50 text-red-500",
  LOGIN:  "bg-purple-50 text-purple-600",
  LOGOUT: "bg-slate-50 text-slate-500",
  APPROVE:"bg-teal-50 text-teal-600",
  REJECT: "bg-orange-50 text-orange-600",
};

const actionColor = (action: string) =>
  ACTION_COLORS[action.toUpperCase()] ?? "bg-slate-50 text-slate-500";

export const AuditoriaAccesoPage: React.FC = () => {
  const [logs, setLogs]           = useState<AuditLog[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filters, setFilters]     = useState<AuditFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async (f?: AuditFilters) => {
    setLoading(true);
    try {
      const { data } = await getAuditLogsApi(f ?? filters);
      setLogs(data);
    } catch {
      toast.error("No se pudieron cargar los registros de auditoría");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs({}); }, []);

  const applyFilters = () => {
    fetchLogs(filters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    const empty: AuditFilters = {};
    setFilters(empty);
    fetchLogs(empty);
    setShowFilters(false);
  };

  const visible = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      log.user?.email?.toLowerCase().includes(q) ||
      log.hospital?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647]">Auditoría de Accesos</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {logs.length} registros encontrados.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0E6BA8] border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FiCalendar size={14} /> Filtros
          </button>
          <button
            onClick={() => fetchLogs(filters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0E6BA8] border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FiRefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      {/* Filtros avanzados */}
      {showFilters && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-bold text-[#0A2647] mb-4">Filtros avanzados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Acción</label>
              <input
                value={filters.action ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, action: e.target.value || undefined }))}
                placeholder="Ej. CREATE"
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                  focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Entidad</label>
              <input
                value={filters.entity ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, entity: e.target.value || undefined }))}
                placeholder="Ej. User"
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                  focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Desde</label>
              <input
                type="date"
                value={filters.from ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                  focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Hasta</label>
              <input
                type="date"
                value={filters.to ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                  focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-[#0E6BA8] transition-colors"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}

      {/* Búsqueda */}
      <div className="flex items-center gap-2.5 bg-white border border-blue-100 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-[#00ACC1] focus-within:ring-2 focus-within:ring-[#00ACC1]/20 transition-all">
        <FiSearch className="text-blue-400 shrink-0" size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por acción, entidad, usuario o hospital..."
          className="bg-transparent text-sm outline-none text-[#0A2647] placeholder:text-slate-400 w-full"
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiActivity size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No hay registros de auditoría</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-50 bg-[#EBF5FB]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">Acción</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">Entidad</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide hidden md:table-cell">Usuario</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide hidden lg:table-cell">Hospital</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {visible.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#0A2647] font-medium">
                    {log.entity}
                    {log.entityId && (
                      <span className="text-slate-400 text-xs ml-1">#{log.entityId}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    {log.user ? (
                      <div className="flex items-center gap-2">
                        <FiUser size={12} className="text-slate-400" />
                        <span className="text-slate-600 truncate max-w-[140px]">
                          {log.user.firstName} {log.user.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">
                    {log.hospital?.name ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("es-GT", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
