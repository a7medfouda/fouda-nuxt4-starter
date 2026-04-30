// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import sassEmbedded from "sass-embedded";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: {
    enabled: true,
    componentInspector: true,
  },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      link: [
        // Preload auth overlay background so it's ready when needed
        { rel: "preload", href: "/imgs/auth-bg.svg", as: "image" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL || "",
    },
  },
  css: [
    "./app/assets/css/main.css",
    "./app/assets/css/transitions.css",
    "./app/assets/main.scss",
  ],
  ui: {
    colorMode: false,
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/hints",
    "@nuxtjs/i18n",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sassEmbedded,
        },
      },
    },
  },
  /*
  Setting it to false forces Nuxt to always load CSS as external files,
  which fixes the HMR (hot module replacement) issue where styles disappear on refresh during development.
   */
  // experimental: {
  //   inlineSSRStyles: false,
  // },
});
