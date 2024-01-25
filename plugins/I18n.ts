export default defineNuxtPlugin(async ({ vueApp }) => {
  await setupI18n();
  vueApp.use(i18n);
});
