export default defineNuxtPlugin(({ vueApp }) => {
  setupI18n();
  vueApp.use(i18n);
});
