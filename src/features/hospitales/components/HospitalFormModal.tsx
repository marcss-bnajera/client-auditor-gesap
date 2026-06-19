import React, { useState, useEffect } from "react";
import { FiX, FiSave, FiLoader, FiCheckCircle } from "react-icons/fi";
import type { Hospital, HospitalPayload, HospitalLevel } from "../../../shared/api/hospitals";
import { HOSPITAL_LEVEL_LABELS } from "../../../shared/api/hospitals";

interface Props {
  hospital: Hospital | null;
  onSave: (payload: HospitalPayload) => Promise<void>;
  onClose: () => void;
}

const LEVELS = Object.entries(HOSPITAL_LEVEL_LABELS) as [HospitalLevel, string][];

const DEPARTMENTS = [
  "Alta Verapaz", "Baja Verapaz", "Chimaltenango", "Chiquimula", "El Progreso",
  "Escuintla", "Guatemala", "Huehuetenango", "Izabal", "Jalapa",
  "Jutiapa", "Petén", "Quetzaltenango", "Quiché", "Retalhuleu",
  "Sacatepéquez", "San Marcos", "Santa Rosa", "Sololá", "Suchitepéquez",
  "Totonicapán", "Zacapa",
];

const empty: HospitalPayload = {
  code: "", name: "", level: "DEPARTAMENTAL", department: "Guatemala",
  municipality: "", address: "", phone: "",
};

export const HospitalFormModal: React.FC<Props> = ({ hospital, onSave, onClose }) => {
  const [form, setForm]     = useState<HospitalPayload>(
    hospital
      ? { code: hospital.code, name: hospital.name, level: hospital.level,
          department: hospital.department, municipality: hospital.municipality,
          address: hospital.address ?? "", phone: hospital.phone ?? "" }
      : empty
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof HospitalPayload, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof HospitalPayload, boolean>>>({});

  useEffect(() => {
    if (hospital) {
      setForm({
        code: hospital.code, name: hospital.name, level: hospital.level,
        department: hospital.department, municipality: hospital.municipality,
        address: hospital.address ?? "", phone: hospital.phone ?? "",
      });
    }
  }, [hospital]);

  const validate = (f: HospitalPayload) => {
    const e: Partial<Record<keyof HospitalPayload, string>> = {};
    if (!f.code.trim())          e.code = "El código es requerido";
    else if (f.code.length > 10) e.code = "Máximo 10 caracteres";
    else if (!/^[A-Z0-9\-]+$/.test(f.code)) e.code = "Solo mayúsculas, números y guiones";
    if (!f.name.trim())          e.name = "El nombre es requerido";
    if (!f.level)                e.level = "El nivel es requerido";
    if (!f.department.trim())    e.department = "El departamento es requerido";
    if (!f.municipality.trim())  e.municipality = "El municipio es requerido";
    return e;
  };

  const change = <K extends keyof HospitalPayload>(k: K, v: HospitalPayload[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };

  const touch = (k: keyof HospitalPayload) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, ...validate(form) }));
  };

  const inputCls = (k: keyof HospitalPayload) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-[#EBF5FB] text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
      touched[k] && errors[k]
        ? "border-red-300 focus:ring-red-300"
        : touched[k] && !errors[k]
        ? "border-emerald-400 focus:ring-emerald-400"
        : "border-blue-200 focus:ring-[#00ACC1]"
    }`;

  const handleSave = async () => {
    const allTouched = Object.fromEntries(
      (["code","name","level","department","municipality"] as const).map((k) => [k, true])
    );
    setTouched(allTouched as typeof touched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await onSave({
        ...form,
        code: form.code.trim().toUpperCase(),
        address: form.address?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] rounded-t-2xl">
          <h3 className="text-white font-bold text-base">
            {hospital ? "Editar Hospital" : "Nuevo Hospital"}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Nombre */}
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
              Nombre completo *
            </label>
            <input
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              onBlur={() => touch("name")}
              placeholder="Ej. Hospital Nacional San Juan de Dios"
              className={inputCls("name")}
            />
            {touched.name && errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
          </div>

          {/* Código + Nivel */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Código * (máx. 10)
              </label>
              <div className="relative">
                <input
                  value={form.code}
                  onChange={(e) => change("code", e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, "").slice(0, 10))}
                  onBlur={() => touch("code")}
                  placeholder="Ej. HSJD"
                  maxLength={10}
                  className={inputCls("code")}
                />
                {touched.code && !errors.code && (
                  <FiCheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500" size={13} />
                )}
              </div>
              {touched.code && errors.code && <p className="text-red-500 text-[10px] mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Nivel *
              </label>
              <select
                value={form.level}
                onChange={(e) => change("level", e.target.value as HospitalLevel)}
                onBlur={() => touch("level")}
                className={`${inputCls("level")} appearance-none`}
              >
                {LEVELS.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              {touched.level && errors.level && <p className="text-red-500 text-[10px] mt-1">{errors.level}</p>}
            </div>
          </div>

          {/* Departamento + Municipio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Departamento *
              </label>
              <select
                value={form.department}
                onChange={(e) => change("department", e.target.value)}
                onBlur={() => touch("department")}
                className={`${inputCls("department")} appearance-none`}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {touched.department && errors.department && <p className="text-red-500 text-[10px] mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Municipio *
              </label>
              <input
                value={form.municipality}
                onChange={(e) => change("municipality", e.target.value)}
                onBlur={() => touch("municipality")}
                placeholder="Ej. Guatemala"
                className={inputCls("municipality")}
              />
              {touched.municipality && errors.municipality && <p className="text-red-500 text-[10px] mt-1">{errors.municipality}</p>}
            </div>
          </div>

          {/* Dirección + Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Dirección
              </label>
              <input
                value={form.address ?? ""}
                onChange={(e) => change("address", e.target.value)}
                placeholder="Ej. 1ª Av. 10-50, Zona 1"
                className={inputCls("address")}
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">
                Teléfono
              </label>
              <input
                value={form.phone ?? ""}
                onChange={(e) => change("phone", e.target.value)}
                placeholder="Ej. 22321234"
                className={inputCls("phone")}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] rounded-xl shadow-md transition-all disabled:opacity-70"
          >
            {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
            {hospital ? "Actualizar" : "Crear Hospital"}
          </button>
        </div>
      </div>
    </div>
  );
};
