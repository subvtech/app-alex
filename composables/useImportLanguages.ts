import { SUPPORT_LOCALES_TYPE } from './useVueI18n';
export const useImportLanguanges = async (
  path: 'components' | 'layouts' | 'pages',
  lang: SUPPORT_LOCALES_TYPE,
  filesName: string[],
) => {
  const page = {};
  filesName.map(async (file) => {
    const importedFile = (
      await import(`../assets/locales/${lang}/${path}/${file}.json`)
    ).default;
    page[file] = importedFile;
  });
  return page;
};