import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/gesap/v1": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/gesap-auditor/v1": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})
