import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    "/api/": {
      target: "https://shopfusion-wjtz.onrender.com",
      changeOrigin: true,
      secure: false,
    },
    "/uploads/": {
      target: "https://shopfusion-wjtz.onrender.com",
      changeOrigin: true,
      secure: false,
    },
  },
});
