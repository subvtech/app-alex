export default defineNuxtPlugin(async ({ vueApp }) => {
  await setupI18n(defaultBrowserLanguage);
  vueApp.use(i18n);
});
