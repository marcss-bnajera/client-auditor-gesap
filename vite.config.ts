import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// base '/auditor/' solo en build — el dev server sigue funcionando en /
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/auditor/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    host: true,
    allowedHosts: true,
    proxy: {
      "/gesap/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/gesap-auditor/v1": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Socket.IO en /auditor-ws (path distinto de /api-ws para coexistir en un solo dominio)
      "/auditor-ws": {
        target: "http://localhost:3001",
        changeOrigin: true,
        ws: true,
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy) => {
          proxy.on("error", (err: NodeJS.ErrnoException) => {
            if (err.code !== "ECONNRESET") console.error("[auditor-ws proxy]", err);
          });
        },
      },
    },
  },
}))
