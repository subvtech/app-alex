// import vuetify from 'vite-plugin-vuetify';
// import { createResolver } from '@nuxt/kit';
// const { resolve } = createResolver(import.meta.url);

export default defineNuxtConfig({
  pages: true,
  ssr: false,
  devtools: { enabled: false },
  css: [
    'vuetify/lib/styles/main.sass',
    'plyr/dist/plyr.css',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  // reference: https://codybontecou.com/how-to-use-vuetify-with-nuxt-3.html
  // hooks: {
  //   'vite:extendConfig': (config) => {
  //     config.plugins?.push(
  //       vuetify({
  //         styles: { configFile: resolve('./assets/settings.scss') },
  //       }),
  //     );
  //   },
  // },
  build: {
    transpile: ['vuetify'],
  },

  modules: ['@pinia/nuxt', '@nuxtjs/strapi', 'nuxt-typed-router'],

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
