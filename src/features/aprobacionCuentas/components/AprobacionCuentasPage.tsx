import React, { useEffect, useState } from "react";
import {
  FiCheckCircle, FiXCircle, FiLoader,
  FiRefreshCw, FiFilter, FiUser,
} from "react-icons/fi";
import {
  getAllAccountsApi, approveAccountApi, rejectAccountApi,
  type PatientAccount, type AccountStatus,
} from "../../../shared/api/patientAccounts";
import toast from "react-hot-toast";
import { AprobacionModal } from "./AprobacionModal";

const statusBadge: Record<AccountStatus, string> = {
  PENDING:  "bg-amber-50 text-amber-600 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-500 border border-red-200",
};

const statusLabel: Record<AccountStatus, string> = {
  PENDING: "Pendiente", APPROVED: "Aprobada", REJECTED: "Rechazada",
};

export const AprobacionCuentasPage: React.FC = () => {
  const [accounts, setAccounts]     = useState<PatientAccount[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState<AccountStatus | "ALL">("ALL");
  const [selected, setSelected]     = useState<PatientAccount | null>(null);
  const [processing, setProcessing] = useState<number | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const { data } = await getAllAccountsApi();
      setAccounts(data);
    } catch {
      toast.error("No se pudieron cargar las cuentas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: number) => {
    setProcessing(id);
    try {
      await approveAccountApi(id);
      toast.success("Cuenta aprobada");
      setSelected(null);
      fetch();
    } catch {
      toast.error("Error al aprobar la cuenta");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessing(id);
    try {
      await rejectAccountApi(id);
      toast.success("Cuenta rechazada");
      setSelected(null);
      fetch();
    } catch {
      toast.error("Error al rechazar la cuenta");
    } finally {
      setProcessing(null);
    }
  };

  const filtered = filter === "ALL"
    ? accounts
    : accounts.filter((a) => a.status === filter);

  const counts = {
    ALL:      accounts.length,
    PENDING:  accounts.filter((a) => a.status === "PENDING").length,
    APPROVED: accounts.filter((a) => a.status === "APPROVED").length,
    REJECTED: accounts.filter((a) => a.status === "REJECTED").length,
  };

  const filterTabs: { key: AccountStatus | "ALL"; label: string }[] = [
    { key: "ALL",      label: `Todas (${counts.ALL})` },
    { key: "PENDING",  label: `Pendientes (${counts.PENDING})` },
    { key: "APPROVED", label: `Aprobadas (${counts.APPROVED})` },
    { key: "REJECTED", label: `Rechazadas (${counts.REJECTED})` },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2647]">Cuentas de Pacientes</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Aprueba o rechaza solicitudes de acceso al portal del paciente.
          </p>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#0E6BA8] border border-blue-200 bg-white rounded-xl hover:bg-blue-50 transition-colors self-start sm:self-auto"
        >
          <FiRefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter size={14} className="text-slate-400" />
        {filterTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === key
                ? "bg-[#0A2647] text-white"
                : "bg-white border border-blue-100 text-slate-500 hover:border-[#0E6BA8] hover:text-[#0E6BA8]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <FiLoader className="animate-spin text-[#0E6BA8]" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-blue-50 rounded-2xl p-10 text-center text-slate-400 shadow-sm">
          <FiUser size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No hay cuentas en esta categoría</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">

          {/* Vista móvil — tarjetas */}
          <div className="md:hidden divide-y divide-blue-50">
            {filtered.map((account) => (
              <div key={account.id} className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {account.email[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[#0A2647] font-semibold text-sm truncate">{account.email}</p>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusBadge[account.status]}`}>
                        {statusLabel[account.status]}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{account.dpi}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(account.createdAt).toLocaleDateString("es-GT")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {account.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApprove(account.id)}
                          disabled={processing === account.id}
                          className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Aprobar"
                        >
                          {processing === account.id
                            ? <FiLoader className="animate-spin" size={15} />
                            : <FiCheckCircle size={15} />
                          }
                        </button>
                        <button
                          onClick={() => handleReject(account.id)}
                          disabled={processing === account.id}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Rechazar"
                        >
                          <FiXCircle size={15} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelected(account)}
                      className="text-xs text-[#0E6BA8] font-medium px-2 py-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista escritorio — tabla */}
          <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-50 bg-[#EBF5FB]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">Paciente</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">DPI</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide hidden md:table-cell">Fecha solicitud</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#144272] uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {filtered.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {account.email[0].toUpperCase()}
                      </div>
                      <span className="text-[#0A2647] font-medium truncate max-w-[160px]">{account.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-slate-600 text-xs">{account.dpi}</td>
                  <td className="px-5 py-4 text-slate-500 hidden md:table-cell">
                    {new Date(account.createdAt).toLocaleDateString("es-GT")}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge[account.status]}`}>
                      {statusLabel[account.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {account.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(account.id)}
                            disabled={processing === account.id}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Aprobar"
                          >
                            {processing === account.id
                              ? <FiLoader className="animate-spin" size={15} />
                              : <FiCheckCircle size={15} />
                            }
                          </button>
                          <button
                            onClick={() => handleReject(account.id)}
                            disabled={processing === account.id}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Rechazar"
                          >
                            <FiXCircle size={15} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelected(account)}
                        className="text-xs text-[#0E6BA8] hover:underline font-medium px-2"
                      >
                        Ver
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {selected && (
        <AprobacionModal
          account={selected}
          processing={processing === selected.id}
          onApprove={() => handleApprove(selected.id)}
          onReject={() => handleReject(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};
