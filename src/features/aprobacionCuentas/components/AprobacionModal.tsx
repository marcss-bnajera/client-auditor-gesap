import React from "react";
import { FiX, FiCheckCircle, FiXCircle, FiLoader, FiUser, FiCreditCard, FiCalendar } from "react-icons/fi";
import type { PatientAccount } from "../../../shared/api/patientAccounts";

interface Props {
  account: PatientAccount;
  processing: boolean;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export const AprobacionModal: React.FC<Props> = ({
  account, processing, onApprove, onReject, onClose,
}) => (
  <div className="modal-backdrop" onClick={onClose}>
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#0A2647]">Detalle de cuenta</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4 p-4 bg-[#EBF5FB] rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-lg font-bold shrink-0">
            {account.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#0A2647]">{account.email}</p>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              account.status === "PENDING"  ? "bg-amber-100 text-amber-700" :
              account.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-600"
            }`}>
              {account.status === "PENDING" ? "Pendiente" : account.status === "APPROVED" ? "Aprobada" : "Rechazada"}
            </span>
          </div>
        </div>

        {/* Datos */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <FiUser className="text-[#0E6BA8] shrink-0" size={15} />
            <span className="text-slate-500 w-28 shrink-0">Correo:</span>
            <span className="text-[#0A2647] font-medium">{account.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiCreditCard className="text-[#0E6BA8] shrink-0" size={15} />
            <span className="text-slate-500 w-28 shrink-0">DPI:</span>
            <span className="text-[#0A2647] font-mono font-semibold">{account.dpi}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <FiCalendar className="text-[#0E6BA8] shrink-0" size={15} />
            <span className="text-slate-500 w-28 shrink-0">Solicitud:</span>
            <span className="text-[#0A2647]">
              {new Date(account.createdAt).toLocaleDateString("es-GT", { dateStyle: "long" })}
            </span>
          </div>
          {account.approvedBy && (
            <div className="flex items-center gap-3 text-sm">
              <FiCheckCircle className="text-emerald-500 shrink-0" size={15} />
              <span className="text-slate-500 w-28 shrink-0">Procesado por:</span>
              <span className="text-[#0A2647]">
                {account.approvedBy.firstName} {account.approvedBy.lastName}
              </span>
            </div>
          )}
        </div>

        {/* Info DPI */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-[#144272]">
          <span className="font-semibold">Verificación requerida:</span> Confirma que el DPI{" "}
          <span className="font-mono font-bold">{account.dpi}</span> corresponde al paciente en el sistema hospitalario antes de aprobar.
        </div>
      </div>

      {/* Actions */}
      {account.status === "PENDING" && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={onReject}
            disabled={processing}
            className="flex-1 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <FiXCircle size={15} /> Rechazar
          </button>
          <button
            onClick={onApprove}
            disabled={processing}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#0A2647] rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {processing
              ? <FiLoader className="animate-spin" size={15} />
              : <FiCheckCircle size={15} />
            }
            Aprobar
          </button>
        </div>
      )}
    </div>
  </div>
);
