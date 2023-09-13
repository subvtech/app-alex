import { WritableComputedRef } from 'nuxt/dist/app/compat/capi';
import { createI18n } from 'vue-i18n';
import { ElementType } from '@/utils';

export const SUPPORT_LOCALES = literalArray('en', 'pt');
export type SUPPORT_LOCALES_TYPE = ElementType<typeof SUPPORT_LOCALES>;
export const i18n = createI18n({
  locale: 'pt',
  legacy: false,
  missingWarn: false,
  globalInjection: true,
});

const loadedLanguages: SUPPORT_LOCALES_TYPE[] = []; // our default language that is preloaded

export const setupI18n = async (locale: SUPPORT_LOCALES_TYPE = 'pt') => {
  setI18nLanguage(locale);
  await loadLanguageAsync(locale);
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
  const loadFiles = async (pages) => {
    const result = {};
    for (const file of Object.keys(pages)) {
      const pageData = await import(/* @vite-ignore */ file);

      const [block, block2, block3] = file.substring(21).split('/');
      if (block3) {
        const innerGroup = block3.split('.')[0];
        if (!result[block]) {
          result[block] = {};
        }

        if (!result[block][block2]) {
          result[block][block2] = {};
        }

        result[block][block2][innerGroup] = {
          ...result[block][block2][innerGroup],
          ...pageData.default,
        };
      } else if (block2) {
        const subGroup = block2.split('.')[0];

        if (!result[block]) {
          result[block] = {};
        }
        result[block][subGroup] = {
          ...result[block][subGroup],
          ...pageData.default,
        };
      } else {
        const subGroup = block.split('.')[0];
        result[subGroup] = {
          ...result[subGroup],
          ...pageData.default,
        };
      }
    }
    return result;
  };

  const translations = await loadFiles(
    lang === i18n.global.locale.value
      ? await import.meta.glob('../assets/locales/pt/**/*.json')
      : await import.meta.glob('../assets/locales/en/**/*.json'),
  );
  i18n.global.setLocaleMessage(lang, translations);
  loadedLanguages.push(lang);
  return setI18nLanguage(lang);
}
