import { useState, useEffect } from "react";
import { FiX, FiShield, FiSave, FiLoader } from "react-icons/fi";
import type { ApiRole } from "../../../shared/api/roles";

interface Props {
  rol: ApiRole | null;
  onClose: () => void;
  onSave: (data: { name: string; description?: string }) => Promise<void>;
}

export const RolFormModal = ({ rol, onClose, onSave }: Props) => {
  const isEdit = !!rol;
  const [name, setName]        = useState(rol?.name ?? "");
  const [description, setDesc] = useState(rol?.description ?? "");
  const [saving, setSaving]    = useState(false);
  const [error, setError]      = useState("");

  useEffect(() => {
    if (rol) { setName(rol.name); setDesc(rol.description ?? ""); }
  }, [rol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("El nombre del rol es requerido"); return; }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim() || undefined });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-[#0A2647] to-[#144272] rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <FiShield className="text-[#26C6DA]" size={18} />
            <h2 className="text-white font-bold text-base">{isEdit ? "Editar Rol" : "Nuevo Rol"}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Nombre del Rol *
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Ej. MEDICO_ESPECIALISTA"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-[#EBF5FB] text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                error ? "border-red-300 focus:ring-red-300" : "border-blue-200 focus:ring-[#00ACC1]"
              }`}
            />
            {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Describe las responsabilidades de este rol..."
              className="w-full px-3 py-2.5 text-sm border border-blue-200 rounded-xl bg-[#EBF5FB] text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] rounded-xl shadow-md transition-all disabled:opacity-70"
            >
              {saving ? <FiLoader className="animate-spin" size={15} /> : <FiSave size={15} />}
              {isEdit ? "Guardar Cambios" : "Crear Rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
