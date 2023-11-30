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
  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxtjs/strapi', 'nuxt-vitest'],
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  image: {
    strapi: {
      baseURL: process.env.STRAPI_URL || 'http://localhost:1337',
    },
  },

  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    auth: {
      populate: ['role', 'learningplans', 'favorites'],
    },
  },
  imports: {
    dirs: ['stores', 'models', 'config'],
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
    ],
  },
});
