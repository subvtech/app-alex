import { createI18n } from 'vue-i18n';

export const SUPPORT_LOCALES = ['en', 'pt'];
export const i18n = createI18n({
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
  if (mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
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
  const rules = (await import(`../assets/locales/${lang}/rules.json`)).default;
  const pages = await useImportJson('pages', lang, ['login', 'register', 'planId', 'reset', 'trailId', 'forgot']);
  const components = await useImportJson('components', lang, [
    'appLearningPlanCard',
    'articleViewer',
    'editor',
    'authors',
    'imagePreview',
    'link',
    'page',
    'sendResetPassword',
    'tagCombobox',
    'usersAutocomplete',
    'viewer',
  ]);
  const layouts = await useImportJson('layouts', lang, ['default', 'error']);
  i18n.global.setLocaleMessage(lang, {
    pages,
    rules,
    components,
    layouts,
  });
  console.log(pages)
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}
