import React, { useState } from "react";
import { FiX, FiSave, FiLoader } from "react-icons/fi";
import type { Hospital, HospitalPayload } from "../../../shared/api/hospitals";

interface Props {
  hospital: Hospital | null;
  onSave: (payload: HospitalPayload) => Promise<void>;
  onClose: () => void;
}

export const HospitalFormModal: React.FC<Props> = ({ hospital, onSave, onClose }) => {
  const [form, setForm]   = useState<HospitalPayload>({
    name:    hospital?.name    ?? "",
    code:    hospital?.code    ?? "",
    address: hospital?.address ?? "",
    phone:   hospital?.phone   ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 text-sm bg-[#EBF5FB] border border-blue-200 rounded-xl text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent transition-all";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0A2647]">
            {hospital ? "Editar hospital" : "Nuevo hospital"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Nombre *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej. Hospital Nacional San Juan"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Código *
            </label>
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="Ej. HNSJ-01"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Dirección
            </label>
            <input
              value={form.address ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Ej. Zona 1, Ciudad de Guatemala"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Teléfono
            </label>
            <input
              value={form.phone ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="Ej. 2222-3333"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim() || !form.code.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-[#0E6BA8] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
            {hospital ? "Actualizar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};
