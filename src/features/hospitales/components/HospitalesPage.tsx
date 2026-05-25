import React, { useEffect, useState } from "react";
import {
  FiHardDrive, FiPlus, FiEdit2, FiToggleLeft, FiToggleRight,
  FiLoader, FiRefreshCw, FiMapPin, FiPhone,
} from "react-icons/fi";
import {
  getHospitalsApi, createHospitalApi, updateHospitalApi, toggleHospitalApi,
  type Hospital, type HospitalPayload,
} from "../../../shared/api/hospitals";
import { useAuthStore } from "../../../features/auth/store/authStore";
import toast from "react-hot-toast";
import { HospitalFormModal } from "./HospitalFormModal";

export const HospitalesPage: React.FC = () => {
  const [hospitals, setHospitals]   = useState<Hospital[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState<Hospital | null>(null);
  const [toggling, setToggling]     = useState<number | null>(null);

  const { user } = useAuthStore();
  const isSuperAuditor = user?.role === "SUPER_AUDITOR";

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getHospitalsApi();
      setHospitals(data);
    } catch {
      toast.error("No se pudieron cargar los hospitales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setShowModal(true); };
  const openEdit   = (h: Hospital) => { setEditing(h); setShowModal(true); };

  const handleSave = async (payload: HospitalPayload) => {
    try {
      if (editing) {
        await updateHospitalApi(editing.id, payload);
        toast.success("Hospital actualizado");
      } else {
        await createHospitalApi(payload);
        toast.success("Hospital creado");
      }
      setShowModal(false);
      fetch();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ?? "Error al guardar"
          : "Error al guardar";
      toast.error(msg);
      throw err;
    }
  };

  const handleToggle = async (id: number) => {
    setToggling(id);
    try {
      await toggleHospitalApi(id);
      toast.success("Estado del hospital actualizado");
      fetch();
    } catch {
      toast.error("Error al cambiar el estado");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647]">Hospitales</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {isSuperAuditor ? "Gestión completa de hospitales del sistema." : "Vista de hospitales (solo lectura para tu rol)."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetch}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0E6BA8] border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition-colors"
          >
            <FiRefreshCw size={14} />
          </button>
          {isSuperAuditor && (
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#0E6BA8] text-white text-sm font-semibold rounded-xl hover:bg-[#00ACC1] transition-colors"
            >
              <FiPlus size={16} /> Nuevo hospital
            </button>
          )}
        </div>
      </div>

      {!isSuperAuditor && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-[#144272] font-medium">
          Como AUDITOR puedes ver todos los hospitales. Solo SUPER_AUDITOR puede crear, editar o desactivar.
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : hospitals.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiHardDrive size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No hay hospitales registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((h) => (
            <div
              key={h.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all ${
                h.isActive ? "border-blue-50" : "border-red-100 opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                    h.isActive
                      ? "bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1]"
                      : "bg-gradient-to-br from-slate-400 to-slate-500"
                  }`}>
                    <FiHardDrive size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-[#0A2647]">{h.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{h.code}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  h.isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-500"
                }`}>
                  {h.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              {(h.address || h.phone) && (
                <div className="space-y-1 mb-3">
                  {h.address && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <FiMapPin size={11} className="shrink-0" /> {h.address}
                    </p>
                  )}
                  {h.phone && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <FiPhone size={11} className="shrink-0" /> {h.phone}
                    </p>
                  )}
                </div>
              )}

              {isSuperAuditor && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-blue-50">
                  <button
                    onClick={() => openEdit(h)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0E6BA8] border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    <FiEdit2 size={12} /> Editar
                  </button>
                  <button
                    onClick={() => handleToggle(h.id)}
                    disabled={toggling === h.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 ${
                      h.isActive
                        ? "text-red-500 border border-red-200 hover:bg-red-50"
                        : "text-emerald-600 border border-emerald-200 hover:bg-emerald-50"
                    }`}
                  >
                    {toggling === h.id
                      ? <FiLoader className="animate-spin" size={12} />
                      : h.isActive ? <FiToggleRight size={12} /> : <FiToggleLeft size={12} />
                    }
                    {h.isActive ? "Desactivar" : "Activar"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <HospitalFormModal
          hospital={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
