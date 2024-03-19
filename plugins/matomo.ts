import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: 'http://profbrenojac.com.br:8090/',
    siteId: nuxtApp.$config.public.matomoAppId,
    router: nuxtApp.$router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    requireCookieConsent: false,
  });
});
