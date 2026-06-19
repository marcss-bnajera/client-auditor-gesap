import React, { useEffect, useState } from "react";
import {
  FiKey, FiLoader, FiSearch, FiRefreshCw, FiCalendar,
} from "react-icons/fi";
import {
  getSessionsHistoryApi,
  type SessionHistory,
  type SessionHistoryFilters,
} from "../../../shared/api/sessions";
import toast from "react-hot-toast";

const parseAgent = (ua?: string | null) => {
  if (!ua) return "—";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Edg\//.test(ua)) return "Edge";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Navegador";
};

const parseOS = (ua?: string | null) => {
  if (!ua) return "";
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "";
};

export const AuditoriaAccesoPage: React.FC = () => {
  const [sessions, setSessions] = useState<SessionHistory[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filters, setFilters]   = useState<SessionHistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const fetchHistory = async (f?: SessionHistoryFilters) => {
    setLoading(true);
    try {
      const { data } = await getSessionsHistoryApi(f ?? filters);
      setSessions(data);
    } catch {
      toast.error("No se pudo cargar el registro de accesos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory({}); }, []);

  const applyFilters = () => { fetchHistory(filters); setShowFilters(false); };
  const clearFilters = () => { const e: SessionHistoryFilters = {}; setFilters(e); fetchHistory(e); setShowFilters(false); };

  const visible = sessions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.userName.toLowerCase().includes(q) ||
      s.userEmail.toLowerCase().includes(q) ||
      (s.hospital?.name ?? "").toLowerCase().includes(q) ||
      (s.ipAddress ?? "").includes(q) ||
      s.roleName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
            <FiKey className="text-[#00ACC1]" /> Registro de Accesos
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Historial de autenticaciones del personal — {sessions.length} registros
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
            onClick={() => fetchHistory(filters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0E6BA8] border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FiRefreshCw size={14} /> Actualizar
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm animate-fadeIn">
          <h3 className="text-sm font-bold text-[#0A2647] mb-4">Filtros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Desde</label>
              <input type="date" value={filters.from ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Hasta</label>
              <input type="date" value={filters.to ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Estado</label>
              <select value={filters.isActive === undefined ? "" : String(filters.isActive)}
                onChange={(e) => setFilters((f) => ({ ...f, isActive: e.target.value === "" ? undefined : e.target.value === "true" }))}
                className="w-full px-3 py-2 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647] focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all">
                <option value="">Todos</option>
                <option value="true">Activas</option>
                <option value="false">Cerradas</option>
              </select>
            </div>
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
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por usuario, correo, hospital, IP o rol..."
          className="bg-transparent text-sm outline-none text-[#0A2647] placeholder:text-slate-400 w-full" />
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiKey size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Sin registros de acceso</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-50 bg-[#EBF5FB]">
                {["Estado", "Usuario", "Rol", "Hospital", "IP", "Dispositivo", "Inicio sesión", "Última actividad"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#144272] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {visible.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {s.isActive ? "Activa" : "Cerrada"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                        {s.userName[0]}
                      </div>
                      <div>
                        <p className="text-[#0A2647] text-xs font-semibold">{s.userName}</p>
                        <p className="text-slate-400 text-[10px]">{s.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0E6BA8]/10 text-[#0E6BA8]">
                      {s.roleName}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">{s.hospital?.name ?? "—"}</td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs font-mono">{s.ipAddress ?? "—"}</td>
                  <td className="px-4 py-3.5 text-slate-500 text-xs">
                    {parseAgent(s.userAgent)}
                    {parseOS(s.userAgent) && <span className="text-slate-400"> / {parseOS(s.userAgent)}</span>}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(s.loginAt).toLocaleString("es-GT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                    {new Date(s.lastActiveAt).toLocaleString("es-GT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
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
