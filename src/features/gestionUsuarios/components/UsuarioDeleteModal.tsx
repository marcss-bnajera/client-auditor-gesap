import { FiAlertTriangle, FiX, FiLoader } from "react-icons/fi";
import { useState } from "react";
import type { ApiUser } from "../../../shared/api/users";

interface Props {
  usuario: ApiUser;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const UsuarioDeleteModal = ({ usuario, onClose, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(usuario.id); onClose(); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FiAlertTriangle className="text-amber-500" size={16} />
            </div>
            <h2 className="text-[#0A2647] font-bold text-base">
              {usuario.isActive ? "Desactivar Usuario" : "Activar Usuario"}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-600 text-sm leading-relaxed">
            ¿Estás seguro de{" "}
            <span className="font-bold">{usuario.isActive ? "desactivar" : "activar"}</span>{" "}
            al usuario{" "}
            <span className="font-bold text-[#0A2647]">
              {usuario.firstName} {usuario.lastName}
            </span>?
          </p>
          <div className={`mt-4 border rounded-xl px-4 py-3 text-xs ${
            usuario.isActive
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            {usuario.isActive
              ? "El usuario perderá acceso al sistema. Puedes reactivarlo en cualquier momento."
              : "El usuario recuperará acceso al sistema."}
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all disabled:opacity-70 ${
              usuario.isActive
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
            }`}
          >
            {loading ? <FiLoader className="animate-spin" size={15} /> : null}
            {usuario.isActive ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>
    </div>
  );
};
