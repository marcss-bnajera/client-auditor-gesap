import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useKickListener } from "../../../shared/hooks/useKickListener";
import type { ReactNode } from "react";

const ALLOWED_ROLES = ["AUDITOR", "SUPER_AUDITOR"];

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  useKickListener();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!ALLOWED_ROLES.includes(user?.role ?? "")) return <Navigate to="/" replace />;

  return <>{children}</>;
};
