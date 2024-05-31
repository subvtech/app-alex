import { resolve } from 'node:path';

const { BASE_URL = 'http://localhost:3000' } = process.env;

export default defineNuxtConfig({
  ssr: false,
  pages: true,
  sourcemap: true,
  devtools: { enabled: true },
  alias: {
    cookie: resolve(__dirname, 'node_modules/cookie'),
  },
  authJs: {
    authenticatedRedirectTo: '/',
    guestRedirectTo: '/login',
    baseUrl: BASE_URL,
  },
  css: [
    'vuetify/lib/styles/main.sass',
    'plyr/dist/plyr.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['trpc-nuxt', 'vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/strapi',
    '@nuxt/test-utils/module',
    '@hebilicious/authjs-nuxt',
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
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET, // You can generate one with `openssl rand -base64 32`
    },
    public: {
      authJs: {
        baseUrl: BASE_URL,
        verifyClientOnEveryRequest: true,
      },
      matomoAppId: process.env.MATOMO_APP_ID,
      matomoUrl: process.env.MATOMO_URL,
      showComponentsPage: process.env.COMPONENTS_PAGE === 'on',
      openAiKey: process.env.OPEN_AI_KEY,
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
