import { Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { DashboardPage } from "../layouts/DashboardPage";
import { AprobacionCuentasPage } from "../../features/aprobacionCuentas/components/AprobacionCuentasPage";
import { AuditoriaAccesoPage } from "../../features/auditoriaAcceso/components/AuditoriaAccesoPage";
import { HospitalesPage } from "../../features/hospitales/components/HospitalesPage";
import { GestionUsuariosPage } from "../../features/gestionUsuarios/components/GestionUsuariosPage";
import { SeguridadRolesPage } from "../../features/seguridadRoles/components/SeguridadRolesPage";
import { MantenimientoDatosPage } from "../../features/mantenimientoDatos/components/MantenimientoDatosPage";
import { ReportesSistemaPage } from "../../features/reportesSistema/components/ReportesSistemaPage";
import { SesionesActivasPage } from "../../features/sesionesActivas/components/SesionesActivasPage";
import { BitacoraAccionesPage } from "../../features/bitacoraAcciones/components/BitacoraAccionesPage";

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
      <Route path="dashboard"    element={<DashboardPage />} />
      <Route path="usuarios"     element={<GestionUsuariosPage />} />
      <Route path="cuentas"      element={<AprobacionCuentasPage />} />
      <Route path="seguridad"    element={<SeguridadRolesPage />} />
      <Route path="auditoria"    element={<AuditoriaAccesoPage />} />
      <Route path="bitacora"     element={<BitacoraAccionesPage />} />
      <Route path="sesiones"     element={<SesionesActivasPage />} />
      <Route path="hospitales"   element={<HospitalesPage />} />
      <Route path="mantenimiento" element={<MantenimientoDatosPage />} />
      <Route path="reportes"     element={<ReportesSistemaPage />} />
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
