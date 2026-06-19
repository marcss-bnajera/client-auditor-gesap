import { FiBarChart2, FiTrendingUp } from "react-icons/fi";

export const ReportesSistemaPage = () => (
  <div className="space-y-5 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
        <FiBarChart2 className="text-[#0E6BA8]" /> Reportes del Sistema
      </h2>
      <p className="text-slate-500 text-sm mt-0.5">Estadísticas y reportes de actividad del sistema</p>
    </div>

    <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center mx-auto mb-4 shadow-lg">
        <FiTrendingUp className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-bold text-[#0A2647] mb-2">Próximamente</h3>
      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
        Los reportes y estadísticas del sistema estarán disponibles en una próxima versión. Incluirá reportes de sesiones, accesos y actividad hospitalaria.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-xs text-[#0E6BA8] font-semibold">
        <FiBarChart2 size={13} /> Módulo en desarrollo
      </div>
    </div>
  </div>
);
