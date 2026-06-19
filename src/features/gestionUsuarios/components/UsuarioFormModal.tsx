import { useState, useEffect } from "react";
import {
  FiX, FiUser, FiMail, FiLock, FiShield, FiSave, FiLoader, FiEye, FiEyeOff, FiCheckCircle,
} from "react-icons/fi";
import type { ApiUser, CreateUserPayload } from "../../../shared/api/users";
import type { ApiRole } from "../../../shared/api/roles";
import type { Hospital } from "../../../shared/api/hospitals";

const ROLES_WITH_HOSPITAL = ["AUDITOR", "DOCTOR", "ASISTENTE_RECEPCION_CLINICA"];
const ROLES_WITH_FLEET    = ["ASISTENTE_PREHOSPITALARIO"];

interface Props {
  usuario: ApiUser | null;
  roles: ApiRole[];
  hospitals: Hospital[];
  onClose: () => void;
  onSave: (data: CreateUserPayload) => Promise<void>;
}

export const UsuarioFormModal = ({ usuario, roles, hospitals, onClose, onSave }: Props) => {
  const isEdit = !!usuario;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roleId: roles[0]?.id ?? 1,
    password: "",
    hospitalId: "" as string | number,
    fleetId: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [touched, setTouched]   = useState<Record<string, boolean>>({});

  const selectedRoleName = roles.find((r) => r.id === Number(form.roleId))?.name ?? "";
  const needsHospital    = ROLES_WITH_HOSPITAL.includes(selectedRoleName);
  const needsFleet       = ROLES_WITH_FLEET.includes(selectedRoleName);

  useEffect(() => {
    if (usuario) {
      setForm({
        firstName: usuario.firstName,
        lastName:  usuario.lastName,
        email:     usuario.email,
        roleId:    usuario.role.id,
        password:  "",
        hospitalId: usuario.hospital?.id ?? "",
        fleetId:   usuario.fleetId ?? "",
      });
    }
  }, [usuario]);

  const validate = (f = form) => {
    const e: Record<string, string> = {};
    if (!f.firstName.trim()) e.firstName = "El nombre es requerido";
    if (!f.lastName.trim())  e.lastName  = "El apellido es requerido";
    if (!f.email.trim())     e.email     = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Correo inválido";
    if (!isEdit) {
      if (!f.password)             e.password = "La contraseña es requerida";
      else if (f.password.length < 8) e.password = "Mínimo 8 caracteres";
      else if (!/[A-Z]/.test(f.password)) e.password = "Debe incluir mayúscula";
      else if (!/[0-9]/.test(f.password)) e.password = "Debe incluir número";
      else if (!/[!@#$%^&*]/.test(f.password)) e.password = "Debe incluir carácter especial (!@#$%^&*)";
    }
    const roleName = roles.find((r) => r.id === Number(f.roleId))?.name ?? "";
    if (ROLES_WITH_HOSPITAL.includes(roleName) && !f.hospitalId) e.hospitalId = "Hospital requerido para este rol";
    if (ROLES_WITH_FLEET.includes(roleName) && !String(f.fleetId).trim()) e.fleetId = "Fleet ID requerido para este rol";
    return e;
  };

  const change = (field: string, value: string | number) => {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const errs = validate(next);
      setErrors((e) => { const ne = { ...e }; delete ne[field]; if (errs[field]) ne[field] = errs[field]; return ne; });
    }
  };

  const touch = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      const roleName = roles.find((r) => r.id === Number(form.roleId))?.name ?? "";
      const payload: CreateUserPayload = {
        email:     form.email,
        firstName: form.firstName,
        lastName:  form.lastName,
        roleId:    Number(form.roleId),
        ...(!isEdit && form.password ? { password: form.password } : {}),
        ...(ROLES_WITH_HOSPITAL.includes(roleName) && form.hospitalId ? { hospitalId: Number(form.hospitalId) } : {}),
        ...(ROLES_WITH_FLEET.includes(roleName) && form.fleetId ? { fleetId: String(form.fleetId) } : {}),
      };
      await onSave(payload);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "";
      if (msg.toLowerCase().includes("correo") || msg.toLowerCase().includes("email")) {
        setErrors({ email: "Este correo ya está en uso" });
      }
    } finally {
      setSaving(false);
    }
  };

  const fieldCls = (field: string) => {
    if (!touched[field]) return "border-blue-200 focus:ring-[#00ACC1]";
    return errors[field]
      ? "border-red-300 focus:ring-red-300"
      : "border-emerald-400 focus:ring-emerald-400";
  };

  const inputBase = "w-full px-3 py-2.5 text-sm border rounded-xl bg-[#EBF5FB] text-[#0A2647] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <FiUser className="text-[#26C6DA]" size={18} />
            <h2 className="text-white font-bold text-base">{isEdit ? "Editar Usuario" : "Nuevo Usuario"}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Nombre *</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={13} />
                <input
                  value={form.firstName}
                  onChange={(e) => change("firstName", e.target.value)}
                  onBlur={() => touch("firstName")}
                  placeholder="Carlos"
                  className={`${inputBase} ${fieldCls("firstName")} pl-8`}
                />
                {touched.firstName && !errors.firstName && (
                  <FiCheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500" size={12} />
                )}
              </div>
              {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Apellido *</label>
              <input
                value={form.lastName}
                onChange={(e) => change("lastName", e.target.value)}
                onBlur={() => touch("lastName")}
                placeholder="García"
                className={`${inputBase} ${fieldCls("lastName")}`}
              />
              {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Correo *</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={13} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => change("email", e.target.value)}
                onBlur={() => touch("email")}
                placeholder="usuario@gesap.gt"
                className={`${inputBase} ${fieldCls("email")} pl-8 ${touched.email && !errors.email ? "pr-8" : ""}`}
              />
              {touched.email && !errors.email && (
                <FiCheckCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500" size={12} />
              )}
            </div>
            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Rol *</label>
            <div className="relative">
              <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={13} />
              <select
                value={form.roleId}
                onChange={(e) => change("roleId", e.target.value)}
                className={`${inputBase} ${fieldCls("roleId")} pl-8 appearance-none`}
              >
                {roles.filter((r) => r.isActive).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hospital (condicional) */}
          {needsHospital && (
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Hospital *</label>
              <select
                value={form.hospitalId}
                onChange={(e) => change("hospitalId", e.target.value)}
                onBlur={() => touch("hospitalId")}
                className={`${inputBase} ${fieldCls("hospitalId")} appearance-none`}
              >
                <option value="">— Seleccionar hospital —</option>
                {hospitals.filter((h) => h.isActive).map((h) => (
                  <option key={h.id} value={h.id}>{h.name} ({h.code})</option>
                ))}
              </select>
              {errors.hospitalId && <p className="text-red-500 text-[10px] mt-1">{errors.hospitalId}</p>}
            </div>
          )}

          {/* Fleet ID (condicional) */}
          {needsFleet && (
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Fleet ID *</label>
              <input
                value={form.fleetId}
                onChange={(e) => change("fleetId", e.target.value)}
                onBlur={() => touch("fleetId")}
                placeholder="Ej. FLOTA-GT-01"
                className={`${inputBase} ${fieldCls("fleetId")}`}
              />
              {errors.fleetId && <p className="text-red-500 text-[10px] mt-1">{errors.fleetId}</p>}
            </div>
          )}

          {/* Contraseña (solo crear) */}
          {!isEdit && (
            <div>
              <label className="block text-[10px] font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Contraseña *</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={13} />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => change("password", e.target.value)}
                  onBlur={() => touch("password")}
                  placeholder="Mín. 8 chars, mayúsc., número, especial"
                  className={`${inputBase} ${fieldCls("password")} pl-8 pr-9`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#0E6BA8] transition-colors"
                >
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] mt-1">{errors.password}</p>}
              {!errors.password && form.password && (
                <p className="text-emerald-600 text-[10px] mt-1 flex items-center gap-1">
                  <FiCheckCircle size={10} /> Contraseña válida
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] rounded-xl shadow-md transition-all disabled:opacity-70">
              {saving ? <FiLoader className="animate-spin" size={15} /> : <FiSave size={15} />}
              {isEdit ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
