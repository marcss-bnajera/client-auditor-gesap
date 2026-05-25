import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { DashboardPage } from "../layouts/DashboardPage";
import { AprobacionCuentasPage } from "../../features/aprobacionCuentas/components/AprobacionCuentasPage";
import { AuditoriaAccesoPage } from "../../features/auditoriaAcceso/components/AuditoriaAccesoPage";
import { HospitalesPage } from "../../features/hospitales/components/HospitalesPage";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginForm />} />

    <Route
      path="/auditor"
      element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"  element={<DashboardPage />} />
      <Route path="cuentas"    element={<AprobacionCuentasPage />} />
      <Route path="auditoria"  element={<AuditoriaAccesoPage />} />
      <Route path="hospitales" element={<HospitalesPage />} />
    </Route>

    <Route path="*" element={
      <div className="min-h-screen bg-[#EBF5FB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-8xl font-extrabold text-[#0A2647]/10">404</p>
          <h2 className="text-2xl font-bold text-[#0A2647] mt-2">Página no encontrada</h2>
          <a href="/" className="mt-4 inline-block text-[#0E6BA8] font-semibold hover:text-[#00ACC1] transition-colors">
            ← Volver al inicio
          </a>
        </div>
      </div>
    } />
  </Routes>
);
