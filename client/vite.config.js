import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["./sections", "./components", "./shadcn-vue"],
    }),
  ],
  root: "./client",
  envDir: "../",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  server: {
    proxy: {
      // with options
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("/shadcn-vue", import.meta.url)),
      "&": fileURLToPath(new URL("/use", import.meta.url)),
    },
  },
});
