export default defineNuxtConfig({
  pages: true,
  ssr: false,
  devtools: { enabled: true },
  css: [
    'vuetify/lib/styles/main.sass',
    'plyr/dist/plyr.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/strapi',
    '@nuxt/test-utils/module',
  ],
  testUtils: {},
  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  image: {
    strapi: {
      baseURL: process.env.STRAPI_URL || 'http://localhost:1337',
    },
  },
  runtimeConfig: {
    public: {
      showComponentsPage: process.env.COMPONENTS_PAGE === 'on',
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    auth: {
      populate: ['role', 'learningplans', 'favorites'],
    },
  },
  imports: {
    dirs: ['stores', 'models', 'config', 'models/simple'],
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
    ],
  },
});
