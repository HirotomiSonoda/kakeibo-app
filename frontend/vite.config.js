import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// バックエンドAPIへの /api リクエストをプロキシしてCORSを回避する
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
