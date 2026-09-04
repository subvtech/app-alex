import type { NuxtPage } from 'nuxt/schema';

const {
  ANTHROPIC_API_KEY,
  COMPONENTS_PAGE,
  MATOMO_APP_ID,
  MATOMO_URL,
  OPEN_AI_KEY,
  STRAPI_URL = 'http://localhost:1337',
  TIPTAP_APP_ID,
  TIPTAP_KEY,
  USE_MOCK,
} = process.env;

export default defineNuxtConfig({
  pages: true,
  ssr: false,
  devtools: { enabled: true },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  css: ['vuetify/lib/styles/main.sass', 'plyr/dist/plyr.css', '@mdi/font/css/materialdesignicons.min.css'],
  build: {
    transpile: ['vue-sonner', 'vuetify'],
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
    anthropicApiKey: ANTHROPIC_API_KEY,
    public: {
      matomoAppId: MATOMO_APP_ID,
      matomoUrl: MATOMO_URL,
      openAiKey: OPEN_AI_KEY,
      showComponentsPage: COMPONENTS_PAGE === 'on',
      strapiUrl: STRAPI_URL,
      tipTapAppId: TIPTAP_APP_ID,
      tipTapKey: TIPTAP_KEY,
      useMock: USE_MOCK === 'true',
    },
  },
  strapi: {
    url: STRAPI_URL,
    auth: { populate: ['role', 'learningplans', 'favorites'] },
  },
  routeRules: USE_MOCK ? { '/_/api/**': { proxy: `${STRAPI_URL}/api/**` } } : undefined,
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
      {
        from: 'vue-slicksort',
        imports: ['SlickList', 'SlickItem'],
      },
    ],
  },
  hooks: {
    'pages:extend'(pages) {
      const removePage = (page: NuxtPage, index: number, items: NuxtPage[]) => {
        if (/^-\w|\/-\w/.test(page.path)) items.splice(index, 1);
        page.children?.forEach(removePage);
      };
      pages.forEach(removePage);
    },
  },
});
