import { FiAlertTriangle, FiX, FiTrash2, FiLoader } from "react-icons/fi";
import { useState } from "react";
import type { ApiRole } from "../../../shared/api/roles";

interface Props {
  rol: ApiRole;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const RolDeleteModal = ({ rol, onClose, onConfirm }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try { await onConfirm(rol.id); onClose(); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle className="text-red-500" size={16} />
            </div>
            <h2 className="text-[#0A2647] font-bold text-base">Eliminar Rol</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-slate-600 text-sm leading-relaxed">
            ¿Estás seguro de eliminar el rol{" "}
            <span className="font-bold text-[#0A2647]">"{rol.name}"</span>?
          </p>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600">
            Esta acción no se puede deshacer. Asegúrate de que ningún usuario tenga este rol antes de eliminarlo.
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
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-md transition-all disabled:opacity-70"
          >
            {loading ? <FiLoader className="animate-spin" size={15} /> : <FiTrash2 size={15} />}
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
