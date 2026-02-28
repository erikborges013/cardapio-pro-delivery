// vite.config.js
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Cardápio da Lanchonete",
        short_name: "Cardápio",
        description: "O cardápio digital da sua lanchonete.",
        theme_color: "#A27B5C",
        background_color: "#2C3639",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,

        globPatterns: [],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: () => true,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
});
