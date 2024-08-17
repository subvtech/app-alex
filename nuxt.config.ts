const {
  COMPONENTS_PAGE,
  MATOMO_APP_ID,
  MATOMO_URL,
  NODE_ENV,
  OPEN_AI_KEY,
  STRAPI_URL = 'http://localhost:1337',
  TIPTAP_APP_ID,
  TIPTAP_KEY,
} = process.env;

const DEV = NODE_ENV === 'development';

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
  modules: [
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@nuxtjs/strapi',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'shadcn-nuxt',
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
    public: {
      matomoAppId: MATOMO_APP_ID,
      matomoUrl: MATOMO_URL,
      openAiKey: OPEN_AI_KEY,
      showComponentsPage: COMPONENTS_PAGE === 'on',
      strapiUrl: STRAPI_URL,
      tipTapAppId: TIPTAP_APP_ID,
      tipTapKey: TIPTAP_KEY,
    },
  },
  strapi: {
    url: DEV ? '/_' : STRAPI_URL,
    auth: {
      populate: ['role', 'learningplans', 'favorites'],
    },
  },
  routeRules: DEV
    ? { '/_/api/**': { proxy: `${STRAPI_URL}/api/**` } }
    : undefined,
  shadcn: {
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
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
