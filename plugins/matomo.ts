import VueMatomo from 'vue-matomo';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueMatomo, {
    host: nuxtApp.$config.public.matomoUrl,
    siteId: nuxtApp.$config.public.matomoAppId,
    router: nuxtApp.$router,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: true,
    requireCookieConsent: false,
  });
});
