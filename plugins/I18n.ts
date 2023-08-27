export default defineNuxtPlugin(async ({ vueApp }) => {
  const i18n = setupI18n({ locale: 'pt' });
  await loadLocaleMessages(i18n, 'pt');
  vueApp.use(i18n);
});
