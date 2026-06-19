import React, { useEffect, useState } from "react";
import {
  FiList, FiLoader, FiSearch, FiRefreshCw, FiCalendar, FiUser,
} from "react-icons/fi";
import {
  getAuditLogsApi, type AuditLog, type AuditFilters,
} from "../../../shared/api/auditLogs";
import toast from "react-hot-toast";

const ACTION_BADGE: Record<string, string> = {
  CREATE:        "bg-emerald-50 text-emerald-700 border border-emerald-200",
  UPDATE:        "bg-blue-50 text-blue-700 border border-blue-200",
  DELETE:        "bg-red-50 text-red-600 border border-red-200",
  LOGIN:         "bg-purple-50 text-purple-700 border border-purple-200",
  LOGOUT:        "bg-slate-100 text-slate-500 border border-slate-200",
  APPROVE:       "bg-teal-50 text-teal-700 border border-teal-200",
  REJECT:        "bg-orange-50 text-orange-600 border border-orange-200",
  TOGGLE_ACTIVE: "bg-amber-50 text-amber-700 border border-amber-200",
};
const badgeClass = (action: string) =>
  ACTION_BADGE[action.toUpperCase()] ?? "bg-slate-100 text-slate-500 border border-slate-200";

const ACTION_LABELS: Record<string, string> = {
  CREATE: "Crear", UPDATE: "Editar", DELETE: "Eliminar",
  LOGIN: "Login", LOGOUT: "Logout", APPROVE: "Aprobar",
  REJECT: "Rechazar", TOGGLE_ACTIVE: "Activar/Desactivar",
};

export const BitacoraAccionesPage: React.FC = () => {
  const [logs, setLogs]       = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState<AuditFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = async (f?: AuditFilters) => {
    setLoading(true);
    try {
      const { data } = await getAuditLogsApi(f ?? filters);
      setLogs(data);
    } catch {
      toast.error("No se pudieron cargar los registros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs({}); }, []);

  const applyFilters = () => { fetchLogs(filters); setShowFilters(false); };
  const clearFilters = () => { const e: AuditFilters = {}; setFilters(e); fetchLogs(e); setShowFilters(false); };

  const visible = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      (log.user?.email ?? "").toLowerCase().includes(q) ||
      (log.hospital?.name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
            <FiList className="text-[#00ACC1]" /> Bitácora de Acciones
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Registro de operaciones realizadas por el personal — {logs.length} entradas
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
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

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-bold text-[#0A2647] mb-4">Filtros avanzados</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(["action", "entity"] as const).map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                  {field === "action" ? "Acción" : "Entidad"}
                </label>
                <input
                  value={filters[field] ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value || undefined }))}
                  placeholder={field === "action" ? "Ej. CREATE" : "Ej. User"}
                  className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
                />
              </div>
            ))}
            {(["from", "to"] as const).map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                  {field === "from" ? "Desde" : "Hasta"}
                </label>
                <input
                  type="date"
                  value={filters[field] ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value || undefined }))}
                  className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647]
                    focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={clearFilters} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">Limpiar</button>
            <button onClick={applyFilters} className="px-4 py-2 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-[#0E6BA8] transition-colors">Aplicar</button>
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
          <FiList size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No hay registros de acciones</p>
          <p className="text-xs mt-1">Las acciones aparecen cuando el personal crea, edita o elimina registros</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-50 bg-[#EBF5FB]">
                {["Acción", "Entidad", "Usuario", "Hospital", "IP", "Fecha"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#144272] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {visible.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass(log.action)}`}>
                      {ACTION_LABELS[log.action.toUpperCase()] ?? log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#0A2647] font-medium">
                    {log.entity}
                    {log.entityId && <span className="text-slate-400 text-xs ml-1">#{log.entityId}</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    {log.user ? (
                      <div className="flex items-center gap-1.5">
                        <FiUser size={12} className="text-slate-400 shrink-0" />
                        <div>
                          <p className="text-[#0A2647] text-xs font-medium">{log.user.firstName} {log.user.lastName}</p>
                          <p className="text-slate-400 text-[10px]">{log.user.email}</p>
                        </div>
                      </div>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{log.hospital?.name ?? <span className="text-slate-300">—</span>}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{log.ipAddress ?? "—"}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("es-GT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="px-5 py-2.5 bg-[#EBF5FB]/50 border-t border-blue-50">
            <span className="text-xs text-slate-400">{visible.length} registros mostrados</span>
          </div>
        </div>
      )}
    </div>
  );
};
