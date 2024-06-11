import { resolve } from 'node:path';

const {
  COMPONENTS_PAGE,
  MATOMO_APP_ID,
  MATOMO_URL,
  NUXT_AUTH_JS_SECRET,
  NUXT_BASE_URL = 'http://localhost:3000',
  OPEN_AI_KEY,
  STRAPI_URL = 'http://localhost:1337',
} = process.env;

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
    baseUrl: NUXT_BASE_URL,
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
      baseURL: STRAPI_URL,
    },
  },
  runtimeConfig: {
    authJs: {
      secret: NUXT_AUTH_JS_SECRET, // You can generate one with `openssl rand -base64 32`
    },
    baseUrl: NUXT_BASE_URL,
    public: {
      authJs: {
        baseUrl: NUXT_BASE_URL,
        verifyClientOnEveryRequest: true,
      },
      matomoAppId: MATOMO_APP_ID,
      matomoUrl: MATOMO_URL,
      openAiKey: OPEN_AI_KEY,
      showComponentsPage: COMPONENTS_PAGE === 'on',
    },
  },
  strapi: {
    url: STRAPI_URL,
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
