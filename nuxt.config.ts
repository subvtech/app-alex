// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  pages: true,
  ssr: false,
  devtools: { enabled: false },
  css: [
    'vuetify/lib/styles/main.sass',
    'plyr/dist/plyr.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt', '@nuxtjs/strapi'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    auth: {
      populate: 'role',
    },
  },
  imports: {
    dirs: ['stores', 'models'],
  },
});
