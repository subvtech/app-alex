
export const useImportJson = async (path: 'components' | 'layouts' | 'pages' , lang: 'pt' | 'en', filesName: string[]) => {
    const page = {}
    filesName.map(async (file) => {
        const importedFile = (await import(`../assets/locales/${lang}/${path}/${file}.json`)).default;
        page[file] = importedFile
    })
    return page;
}