import { FiDatabase, FiTool } from "react-icons/fi";

export const MantenimientoDatosPage = () => (
  <div className="space-y-5 animate-fadeIn">
    <div>
      <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
        <FiDatabase className="text-[#1A5276]" /> Mantenimiento de Datos
      </h2>
      <p className="text-slate-500 text-sm mt-0.5">Herramientas de administración de base de datos</p>
    </div>

    <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A2647] to-[#0E6BA8] flex items-center justify-center mx-auto mb-4 shadow-lg">
        <FiTool className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-bold text-[#0A2647] mb-2">Próximamente</h3>
      <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
        Las herramientas de mantenimiento de base de datos estarán disponibles en una próxima versión del sistema.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-xs text-[#0E6BA8] font-semibold">
        <FiDatabase size={13} /> Módulo en desarrollo
      </div>
    </div>
  </div>
);
