import { resolve } from 'node:path';

const {
  NUXT_AUTH_JS_SECRET,
  NUXT_BASE_URL = 'http://localhost:3000',
  NUXT_PUBLIC_AUTH_JS_BASE_URL = NUXT_BASE_URL,
  NUXT_PUBLIC_MATOMO_APP_ID,
  NUXT_PUBLIC_MATOMO_URL,
  NUXT_PUBLIC_OPEN_AI_KEY,
  NUXT_PUBLIC_SHOW_COMPONENTS_PAGE,
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
        baseUrl: NUXT_PUBLIC_AUTH_JS_BASE_URL,
        verifyClientOnEveryRequest: true,
      },
      matomoAppId: NUXT_PUBLIC_MATOMO_APP_ID,
      matomoUrl: NUXT_PUBLIC_MATOMO_URL,
      openAiKey: NUXT_PUBLIC_OPEN_AI_KEY,
      showComponentsPage: NUXT_PUBLIC_SHOW_COMPONENTS_PAGE === 'on',
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
