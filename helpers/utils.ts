export const getFullnameInitials = (fullname = '') => {
  const names = fullname.split(' ');
  const getInitial = (name) => (name ? name[0].toUpperCase() : '');

  const firstLetter = getInitial(names[0]);
  const secondLetter = getInitial(names[1]);

  return `${firstLetter}${secondLetter}`;
};

export const formRules = {
  requiredRule: (val: string) => !!val || 'Campo obrigatório',
  min5CharactersRule: (val: string) =>
    (val && val.length >= 5) || 'Mínimo de 5 caracteres',
};

export async function createFileFromUrl(
  url: string,
  name: string,
  extension = '.jpg',
) {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: `image/${extension.replace('.', '')}`,
  };
  const file = new File([data], name, metadata);

  return file;
}

export function withTimeout(ms, promise) {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(`Timed out in ${ms}ms.`);
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

export const passwordRules = {
  requiredRule: (val: string) => !!val || 'Senha é obrigatória',
  requiredConfirmationRule: (val: string) =>
    !!val || 'Confirmação é obrigatória',
  min8CharactersRule: (val: string) =>
    (val && val.length >= 8) || 'A senha deve ter no mínimo 8 caracteres',
  charactersRule: (val: string) =>
    (/[A-Z]/.test(val) &&
      /[a-z]/.test(val) &&
      /\d/.test(val) &&
      /\W/.test(val)) ||
    'A senha deve conter uma combinação de letras maiúsculas e minusculas, números e símbolos',
  passwordConfirmationRule: (val: string, confirmation: string) => {
    if (confirmation) {
      return val === confirmation || 'Senhas diferentes';
    }
  },
};

// Gets the return of stringLiterals and convert this => ('goiaba' | 'maconha')[] to 'goiaba' | 'maconha'
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

// Iinstead return of string[], gonna return a type of each element of array ex:
// ['goiaba' | 'maconha'] =>  type = ('goiaba' | 'maconha')[]
export function literalArray<T extends string>(...args: T[]): T[] {
  return args;
}
