import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../../features/auth/store/authStore";

export const useKickListener = () => {
  const { token, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const socket = io(window.location.origin + "/sessions", {
      auth: { token },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionDelay: 2000,
      path: "/auditor-ws",
    });

    socket.on("session:kicked", () => {
      socket.disconnect();
      logout();
      window.location.replace(`${base}/?kicked=true`);
    });

    return () => { socket.disconnect(); };
  }, [isAuthenticated, token, logout]);
};
