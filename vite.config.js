import { defineConfig } from "vite";

export default defineConfig({
  base: "/VLAD-PAVLOV/", // имя репозитория
  css: {
    preprocessorOptions: {
      less: { javascriptEnabled: true },
    },
  },
  build: {
    outDir: "docs", // <- собирать прямо в /docs для GitHub Pages
    emptyOutDir: true,
  },
});
