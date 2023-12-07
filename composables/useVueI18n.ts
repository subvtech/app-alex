import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { createI18n } from 'vue-i18n';
import { ElementType, literalArray } from '../utils';
import { useImportLanguages } from './useImportedLanguages';

export const SUPPORT_LOCALES = literalArray('en', 'pt');
export type SUPPORT_LOCALES_TYPE = ElementType<typeof SUPPORT_LOCALES>;
export const i18n = createI18n({
  locale: 'pt',
  legacy: false,
  missingWarn: false,
  globalInjection: true,
});

const loadedLanguages: SUPPORT_LOCALES_TYPE[] = []; // our default language that is preloaded

export const setupI18n = (locale: SUPPORT_LOCALES_TYPE = 'pt') => {
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

export async function loadLanguageAsync(lang: SUPPORT_LOCALES_TYPE) {
  // If the same language
  if (
    i18n.global.locale ===
    (lang as unknown as WritableComputedRef<SUPPORT_LOCALES_TYPE>)
  ) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang));
  }

  // If the language hasn't been loaded yet
  const rules = (await import(`../assets/locales/${lang}/rules.json`)).default;
  const pages = await useImportLanguages('pages', lang, [
    'login',
    'register',
    'planId',
    'reset',
    'profile',
    'trailId',
    'forgot',
    'emailConfirmation',
  ]);
  const components = await useImportLanguages('components', lang, [
    'appLearningPlanCard',
    'articleViewer',
    'imagePreview',
    'tagCombobox',
    'usersAutocomplete',
    'learningPlan/editor',
    'learningPlan/authors',
    'learningPlan/link',
    'learningPlan/list',
    'learningPlan/page',
    'learningPlan/viewer',
    'forgot/sendResetPassword',
    'profile/about',
    'profile/competences',
    'profile/courses',
    'profile/events',
    'profile/general',
    'profile/institutional',
    'profile/projects',
    'profile/security',
    'profile/settings',
    'profile/socials',
    'profile/wallets',
  ]);
  const layouts = await useImportLanguages('layouts', lang, [
    'default',
    'error',
  ]);
  i18n.global.setLocaleMessage(lang, {
    pages,
    rules,
    components,
    layouts,
  });
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}
