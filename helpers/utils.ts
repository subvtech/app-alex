export const getFullnameInitials = (fullname: string = '') => {
    const names = fullname.split(' ');
    const firstLetter = names[0][0].toUpperCase();
    const secondLetter = names[1][0].toUpperCase();
    return `${firstLetter}${secondLetter}`;
}


export const formRules = {
    requiredRule: (val: string) => !!val || 'Campo obrigatório',
    min5CharactersRule: (val: string) => val && val.length >= 5 || 'Mínimo de 5 caracteres',
}

export async function createFileFromUrl(url: string, name: string, extension = '.jpg') {
    const response = await fetch(url);
    const data = await response.blob();
    const metadata = {
        type: `image/${extension.replace('.', '')}`
    };
    const file = new File([data], name, metadata);

    return file
}