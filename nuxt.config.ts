// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  devtools: { enabled: false },
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify"],
  },
  modules: ["@pinia/nuxt", "@nuxtjs/strapi"],
  pinia: {
    autoImports: ["defineStore", "storeToRefs"],
  },
  strapi: {
    url: process.env.STRAPI_URL || "http://localhost:1337",
  },
  imports: {
    dirs: ["stores", "models"],
  },
});
