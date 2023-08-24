import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

export default defineNuxtConfig({
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [
          resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json'),
        ],
      }),
    ],
  },
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
      populate: ['role', 'learningplans', 'favorites'],
    },
  },

  imports: {
    dirs: ['stores', 'models'],
  },
});
