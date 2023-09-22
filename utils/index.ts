const extensions = literalArray('.jpeg', '.jpg', '.png', '.webp');

export const getFullnameInitials = (fullname = '') => {
  const names = fullname.split(' ');
  const getInitial = (name) => (name ? name[0].toUpperCase() : '');

  const firstLetter = getInitial(names[0]);
  const secondLetter = getInitial(names[1]);

  return `${firstLetter}${secondLetter}`;
};

export async function createFileFromUrl(
  url: string,
  name: string,
  extension: ElementType<typeof extensions> | (string & {}) = '.jpg',
) {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = {
    type: `image/${extension.replace('.', '')}`,
  };
  const file = new File([data], name, metadata);

  return file;
}

export function withTimeout<T>(ms: number, promise: Promise<T>): Promise<T> {
  const timeout = new Promise<T>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(`Timed out in ${ms}ms.`);
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

// Gets the return of stringLiterals and convert this => ('goiaba' | 'maconha')[] to 'goiaba' | 'maconha'
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

// Iinstead return of string[], gonna return a type of each element of array ex:
// ['goiaba' | 'maconha'] =>  type = ('goiaba' | 'maconha')[]
export function literalArray<T extends string>(...args: T[]): T[] {
  return args;
}

export const formRules = {
  requiredRule: (val: string) => !!val || 'Campo obrigatório',
  min5CharactersRule: (val: string) =>
    (val && val.length >= 5) || 'Mínimo de 5 caracteres',
};
