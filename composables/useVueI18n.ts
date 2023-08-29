import { createI18n } from 'vue-i18n';

export const SUPPORT_LOCALES = ['en', 'pt'];
export let i18n = createI18n({
  locale: 'pt',
  legacy: false,
  missingWarn: false,
  globalInjection: true,
});
const loadedLanguages: string[] = []; // our default language that is preloaded

export const setupI18n = (locale: string = 'pt') => {
  setI18nLanguage(locale);
  loadLanguageAsync(locale);
};

export function setI18nLanguage(locale) {
  let mode = i18n.mode;
  console.log(i18n);
  if (mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    console.log(mode);
    i18n.global.locale.value = locale;
  }
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector('html')!.setAttribute('lang', locale);
}

export async function loadLanguageAsync(lang) {
  // If the same language
  if (i18n.global.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet

  const login = (await import(`../assets/locales/${lang}/pages/login.json`))
    .default;
  const register = (
    await import(`../assets/locales/${lang}/pages/register.json`)
  ).default;
  const planId = (await import(`../assets/locales/${lang}/pages/planId.json`))
    .default;
  const reset = (await import(`../assets/locales/${lang}/pages/reset.json`))
    .default;
  const trailId = (await import(`../assets/locales/${lang}/pages/trailId.json`))
    .default;
  const rules = (await import(`../assets/locales/${lang}/rules.json`)).default;

  const appLearningPlanCard = (
    await import(
      `../assets/locales/${lang}/components/appLearningPlanCard.json`
    )
  ).default;
  const articleViewer = (
    await import(`../assets/locales/${lang}/components/articleViewer.json`)
  ).default;
  const editor = (
    await import(`../assets/locales/${lang}/components/editor.json`)
  ).default;
  const authors = (
    await import(`../assets/locales/${lang}/components/authors.json`)
  ).default;
  const imagePreview = (
    await import(`../assets/locales/${lang}/components/imagePreview.json`)
  ).default;
  const link = (await import(`../assets/locales/${lang}/components/link.json`))
    .default;
  const page = (await import(`../assets/locales/${lang}/components/page.json`))
    .default;
  const sendResetPassword = (
    await import(`../assets/locales/${lang}/components/sendResetPassword.json`)
  ).default;
  const tagCombobox = (
    await import(`../assets/locales/${lang}/components/tagCombobox.json`)
  ).default;
  const userAutocomplete = (
    await import(`../assets/locales/${lang}/components/usersAutocomplete.json`)
  ).default;
  const viewer = (
    await import(`../assets/locales/${lang}/components/viewer.json`)
  ).default;

  i18n.global.setLocaleMessage(lang, {
    pages: { login, register, planId, reset, trailId },
    rules,
    components: {
      appLearningPlanCard,
      articleViewer,
      editor,
      authors,
      imagePreview,
      link,
      page,
      sendResetPassword,
      tagCombobox,
      userAutocomplete,
      viewer,
    },
  });

  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}
