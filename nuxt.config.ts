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
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
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
      matomoAppId: process.env.MATOMO_APP_ID,
      matomoUrl: process.env.MATOMO_URL,
      showComponentsPage: process.env.COMPONENTS_PAGE === 'on',
      openAiKey: process.env.OPEN_AI_KEY,
      tipTapKey: process.env.TIPTAP_KEY,
      tipTapAppId: process.env.TIPTAP_APP_ID,
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    auth: {
      populate: ['role', 'learningplans', 'favorites'],
    },
  },
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
