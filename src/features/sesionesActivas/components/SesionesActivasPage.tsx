import { useState, useEffect, useCallback, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import {
  FiActivity, FiLoader, FiRefreshCw, FiLogOut, FiWifi, FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { getActiveSessionsApi, kickSessionApi, type ActiveSession } from "../../../shared/api/sessions";
import { useAuthStore } from "../../auth/store/authStore";
import { KickModal } from "./KickModal";

const REFRESH_INTERVAL = 8_000;

const activityColor = (lastActive: string) => {
  const mins = (Date.now() - new Date(lastActive).getTime()) / 60_000;
  if (mins < 5)  return { dot: "bg-emerald-500", label: "Activo",   text: "text-emerald-600" };
  if (mins < 15) return { dot: "bg-amber-400",   label: "Inactivo", text: "text-amber-600" };
  return           { dot: "bg-slate-400",        label: "Offline",  text: "text-slate-400" };
};

export const SesionesActivasPage = () => {
  const { user: currentUser } = useAuthStore();
  const [sessions, setSessions]       = useState<ActiveSession[]>([]);
  const [loading, setLoading]         = useState(true);
  const [kicking, setKicking]         = useState<ActiveSession | null>(null);
  const [lastUpdate, setLastUpdate]   = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo]   = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const fetchSessions = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await getActiveSessionsApi();
      setSessions(data);
      setLastUpdate(new Date());
      setSecondsAgo(0);
    } catch {
      if (!silent) toast.error("No se pudieron cargar las sesiones activas");
    } finally {
      setLoading(false);
    }
  }, []);

  // WebSocket: recibe 'sessions:changed' cuando hay un kick u otro cambio
  useEffect(() => {
    const socket = io(window.location.origin + "/sessions", {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 2000,
      path: "/auditor-ws",
    });
    socketRef.current = socket;

    socket.on("connect",    () => setWsConnected(true));
    socket.on("disconnect", () => setWsConnected(false));
    socket.on("sessions:changed", () => fetchSessions(true));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [fetchSessions]);

  // Polling de respaldo cada 8s (cubre nuevos logins)
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(() => fetchSessions(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  // Contador "hace X segundos"
  useEffect(() => {
    if (!lastUpdate) return;
    timerRef.current = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdate.getTime()) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lastUpdate]);

  const handleKick = async (session: ActiveSession) => {
    try {
      await kickSessionApi(session.id);
      toast.success(`Sesión de ${session.userName} cerrada`);
      await fetchSessions(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al cerrar la sesión");
      throw err;
    }
  };

  const currentUserId = (currentUser as { id?: number } | null)?.id;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
            <FiActivity className="text-[#00ACC1]" /> Sesiones Activas
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {sessions.length} {sessions.length === 1 ? "sesión activa" : "sesiones activas"}
            {lastUpdate && (
              <span className="ml-2 text-slate-400">· Actualizado hace {secondsAgo}s</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs border rounded-xl px-3 py-2 ${
            wsConnected
              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
              : "text-slate-400 bg-white border-blue-100"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
            {wsConnected ? "Tiempo real activo" : "Conectando..."}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-blue-100 rounded-xl px-3 py-2">
            <FiClock size={12} className="text-[#00ACC1]" />
            Polling 8s
          </div>
          <button
            onClick={() => fetchSessions()}
            className="p-2.5 bg-white border border-blue-200 text-[#0E6BA8] rounded-xl hover:bg-blue-50 transition-colors"
            title="Actualizar"
          >
            <FiRefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs text-slate-500 bg-white/80 border border-blue-100 rounded-xl px-4 py-2.5">
        <span className="font-semibold text-[#144272]">Última actividad:</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt; 5 min</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> 5–15 min</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> &gt; 15 min</span>
      </div>

      {/* Tabla */}
      <div className="bg-white/80 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EBF5FB] border-b border-blue-100">
                {["Estado", "Usuario", "Rol", "Hospital", "IP", "Inicio sesión", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#144272] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-14">
                    <FiLoader className="animate-spin text-[#0E6BA8] mx-auto" size={24} />
                    <p className="text-slate-400 text-sm mt-2">Cargando sesiones...</p>
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <FiWifi className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-400 text-sm font-medium">No hay sesiones activas</p>
                    <p className="text-slate-300 text-xs mt-1">Las sesiones aparecen cuando los usuarios inician sesión</p>
                  </td>
                </tr>
              ) : (
                sessions.map((session, i) => {
                  const isSelf = session.userId === currentUserId;
                  const status = activityColor(session.lastActiveAt);
                  return (
                    <tr
                      key={session.id}
                      className={`border-b border-blue-50 transition-colors ${
                        isSelf ? "bg-blue-50/60" : i % 2 !== 0 ? "bg-[#F8FBFF] hover:bg-blue-50/30" : "hover:bg-blue-50/30"
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.text}`}>
                          <span className={`w-2 h-2 rounded-full ${status.dot} ${status.dot === "bg-emerald-500" ? "animate-pulse" : ""}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {session.userName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A2647] text-xs">{session.userName}</p>
                            <p className="text-slate-400 text-[10px]">{session.userEmail}</p>
                            {isSelf && <span className="text-[10px] text-blue-400 font-medium">Tu sesión</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0E6BA8]/10 text-[#0E6BA8]">
                          {session.roleName}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {session.hospital?.name ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">
                        {session.ipAddress ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {new Date(session.loginAt).toLocaleString("es-GT", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        {isSelf ? (
                          <span className="text-xs text-slate-300">—</span>
                        ) : (
                          <button
                            onClick={() => setKicking(session)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <FiLogOut size={13} /> Cerrar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-[#EBF5FB]/50 border-t border-blue-100">
          <span className="text-xs text-slate-400">{sessions.length} sesiones activas en el sistema</span>
        </div>
      </div>

      {kicking && (
        <KickModal
          session={kicking}
          onClose={() => setKicking(null)}
          onConfirm={() => handleKick(kicking)}
        />
      )}
    </div>
  );
};
