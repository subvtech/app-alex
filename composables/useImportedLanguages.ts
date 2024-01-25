import { SUPPORT_LOCALES_TYPE } from './useVueI18n';
export const useImportLanguages = async (
  path: 'components' | 'layouts' | 'pages',
  lang: SUPPORT_LOCALES_TYPE,
  filesName: string[],
) => {
  const page = {};
  filesName.map(async (file) => {
    const [folder, filename] = file.split('/');
    if (filename) {
      const importedFile = await import(
        `../assets/locales/${lang}/${path}/${folder}/${filename}.json`
      );
      if (!page[folder]) page[folder] = {};
      page[folder][filename] = importedFile.default;
    } else {
      const importedFile = await import(
        `../assets/locales/${lang}/${path}/${file}.json`
      );
      page[file] = importedFile.default;
    }
  });
  return page;
};
