import { useState, useEffect, useCallback } from "react";
import {
  FiPlus, FiSearch, FiEdit2, FiUsers,
  FiFilter, FiLoader, FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { UsuarioFormModal } from "./UsuarioFormModal";
import { UsuarioDeleteModal } from "./UsuarioDeleteModal";
import {
  getUsersApi, createUserApi, updateUserApi, toggleUserActiveApi,
  type ApiUser, type CreateUserPayload,
} from "../../../shared/api/users";
import { getRolesApi, type ApiRole } from "../../../shared/api/roles";
import { getActiveHospitalsApi, type Hospital } from "../../../shared/api/hospitals";
import { useAuthStore } from "../../auth/store/authStore";

export const GestionUsuariosPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers]           = useState<ApiUser[]>([]);
  const [roles, setRoles]           = useState<ApiRole[]>([]);
  const [hospitals, setHospitals]   = useState<Hospital[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterActive, setFilter]   = useState<"todos" | "activos" | "inactivos">("activos");
  const [showForm, setShowForm]     = useState(false);
  const [editUser, setEditUser]     = useState<ApiUser | null>(null);
  const [toggleUser, setToggleUser] = useState<ApiUser | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes, hospitalsRes] = await Promise.all([
        getUsersApi(),
        getRolesApi(),
        getActiveHospitalsApi(),
      ]);
      setUsers(usersRes.data);
      setRoles(rolesRes.data);
      setHospitals(hospitalsRes.data);
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filterActive === "todos" ? true :
      filterActive === "activos" ? u.isActive : !u.isActive;
    return matchSearch && matchFilter;
  });

  const handleSave = async (data: CreateUserPayload) => {
    try {
      if (editUser) {
        const { password: _pw, ...updateData } = data;
        await updateUserApi(editUser.id, updateData);
        toast.success("Usuario actualizado correctamente");
      } else {
        await createUserApi(data);
        toast.success("Usuario creado correctamente");
      }
      fetchData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al guardar");
      throw err;
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleUserActiveApi(id);
      const usr = users.find((u) => u.id === id);
      toast.success(usr?.isActive ? "Usuario desactivado" : "Usuario activado");
      fetchData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Error al cambiar estado");
      throw err;
    }
  };

  const openCreate = () => { setEditUser(null); setShowForm(true); };
  const openEdit   = (u: ApiUser) => { setEditUser(u); setShowForm(true); };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647] flex items-center gap-2">
            <FiUsers className="text-[#00ACC1]" /> Gestión de Usuarios
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">{users.length} usuarios registrados en el sistema</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData}
            className="p-2.5 bg-white border border-blue-200 text-[#0E6BA8] rounded-xl hover:bg-blue-50 transition-colors"
            title="Recargar">
            <FiRefreshCw size={15} />
          </button>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] text-white text-sm font-semibold rounded-xl shadow-md hover:from-[#144272] hover:to-[#00ACC1] transition-all active:scale-95">
            <FiPlus size={16} /> Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white/80 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-[#EBF5FB] border border-blue-100 rounded-xl px-3 py-2 flex-1 focus-within:ring-2 focus-within:ring-[#00ACC1]/30 transition-all">
          <FiSearch className="text-blue-400 shrink-0" size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o rol..."
            className="bg-transparent text-sm outline-none text-[#0A2647] placeholder:text-slate-400 w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter size={14} className="text-slate-400 shrink-0" />
          {(["activos", "inactivos", "todos"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-semibold rounded-xl transition-colors capitalize ${
                filterActive === f ? "bg-[#0E6BA8] text-white shadow-sm" : "bg-[#EBF5FB] text-slate-500 hover:bg-blue-100"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white/80 border border-blue-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EBF5FB] border-b border-blue-100">
                {["Usuario", "Correo", "Rol", "Hospital / Flota", "Estado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#144272] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-14">
                    <FiLoader className="animate-spin text-[#0E6BA8] mx-auto" size={24} />
                    <p className="text-slate-400 text-sm mt-2">Cargando usuarios...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <FiUsers className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-400 text-sm">No se encontraron usuarios</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u, i) => {
                  const isSelf = u.id === (currentUser as { id?: number } | null)?.id;
                  return (
                    <tr key={u.id} className={`border-b border-blue-50 hover:bg-blue-50/40 transition-colors ${i % 2 !== 0 ? "bg-[#F8FBFF]" : ""}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-[#0A2647] leading-tight">{u.firstName} {u.lastName}</p>
                            {isSelf && <span className="text-[10px] text-blue-400 font-medium">Tú</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0E6BA8]/10 text-[#0E6BA8]">
                          {u.role.name}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs">
                        {u.hospital?.name ?? (u.fleetId ? `Flota: ${u.fleetId}` : "—")}
                      </td>
                      <td className="px-5 py-3.5">
                        {/* Toggle visual switch */}
                        <button
                          onClick={() => !isSelf && setToggleUser(u)}
                          disabled={isSelf}
                          title={isSelf ? "No puedes desactivarte a ti mismo" : u.isActive ? "Desactivar" : "Activar"}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                            isSelf ? "opacity-40 cursor-not-allowed" :
                            u.isActive ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer" : "bg-slate-300 hover:bg-slate-400 cursor-pointer"
                          }`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                            u.isActive ? "translate-x-4" : "translate-x-1"
                          }`} />
                        </button>
                        <span className={`ml-2 text-xs font-medium ${u.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                          {u.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => openEdit(u)}
                          className="p-1.5 text-[#0E6BA8] hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar">
                          <FiEdit2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 bg-[#EBF5FB]/50 border-t border-blue-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Mostrando {filtered.length} de {users.length} usuarios
          </span>
        </div>
      </div>

      {showForm && (
        <UsuarioFormModal
          usuario={editUser}
          roles={roles}
          hospitals={hospitals}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
      {toggleUser && (
        <UsuarioDeleteModal
          usuario={toggleUser}
          onClose={() => setToggleUser(null)}
          onConfirm={handleToggle}
        />
      )}
    </div>
  );
};
