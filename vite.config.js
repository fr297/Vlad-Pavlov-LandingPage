import { defineConfig } from "vite";

export default defineConfig({
  base: "/VLAD-PAVLOV/", // имя репозитория для GitHub Pages
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
  build: { outDir: "docs", emptyOutDir: true }, // билд прямо в /docs
});
