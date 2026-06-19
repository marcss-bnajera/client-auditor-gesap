import { useState, useEffect, useCallback } from "react";
import { FiShield, FiPlus, FiEdit2, FiTrash2, FiLoader, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import { RolFormModal } from "./RolFormModal";
import { RolDeleteModal } from "./RolDeleteModal";
import { getRolesApi, createRoleApi, updateRoleApi, deleteRoleApi, type ApiRole } from "../../../shared/api/roles";

const GRAD = [
  "from-[#0A2647] to-[#0E6BA8]",
  "from-[#26A69A] to-[#00BFA5]",
  "from-[#6C3483] to-[#8E44AD]",
  "from-[#E67E22] to-[#F39C12]",
  "from-[#1A5276] to-[#2E86C1]",
];

export const SeguridadRolesPage = () => {
  const [roles, setRoles]         = useState<ApiRole[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editRol, setEditRol]     = useState<ApiRole | null>(null);
  const [deleteRol, setDeleteRol] = useState<ApiRole | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getRolesApi();
      setRoles(data);
    } catch {
      toast.error("Error al cargar roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (data: { name: string; description?: string }) => {
    if (editRol) {
      await updateRoleApi(editRol.id, data);
      toast.success("Rol actualizado");
    } else {
      await createRoleApi(data);
      toast.success("Rol creado");
    }
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await deleteRoleApi(id);
    toast.success("Rol eliminado");
    fetchData();
  };

  const openCreate = () => { setEditRol(null); setShowForm(true); };
  const openEdit   = (r: ApiRole) => { setEditRol(r); setShowForm(true); };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
            <FiShield className="text-[#144272]" /> Seguridad y Roles
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{roles.length} roles configurados en el sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 bg-white border border-blue-200 text-[#0E6BA8] rounded-xl hover:bg-blue-50 transition-colors"
            title="Recargar"
          >
            <FiRefreshCw size={15} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A2647] to-[#144272] text-white text-sm font-semibold rounded-xl shadow-md hover:from-[#144272] hover:to-[#205295] transition-all active:scale-95"
          >
            <FiPlus size={16} /> Nuevo Rol
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : roles.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiShield size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No hay roles configurados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((rol, i) => (
            <div
              key={rol.id}
              className="bg-white/80 border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRAD[i % GRAD.length]} flex items-center justify-center text-white shadow-md`}>
                  <FiShield size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rol.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                  }`}>
                    {rol.isActive ? "Activo" : "Inactivo"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(rol)}
                      className="p-1.5 text-[#0E6BA8] hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteRol(rol)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-[#0A2647] text-base mb-1">{rol.name}</h3>
              <p className="text-slate-400 text-xs leading-snug mb-3">
                {rol.description ?? "Sin descripción"}
              </p>
              <div className="text-[10px] text-slate-400">
                Creado: {new Date(rol.createdAt).toLocaleDateString("es-GT")}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <RolFormModal
          rol={editRol}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
      {deleteRol && (
        <RolDeleteModal
          rol={deleteRol}
          onClose={() => setDeleteRol(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};
