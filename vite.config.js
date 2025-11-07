import { defineConfig } from "vite";

export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // нужно для некоторых библиотек Less
      },
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true, // очищает dist перед сборкой
  },
  base: "/VLAD-PAVLOV/", // важно для GitHub Pages
});
