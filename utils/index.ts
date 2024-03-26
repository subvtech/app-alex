// Gets the return of stringLiterals and convert this => ('goiaba' | 'maconha')[] to 'goiaba' | 'maconha'
import { compareDesc } from 'date-fns';
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

const extensions = literalArray('.jpeg', '.jpg', '.png', '.webp');

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
  const timeout = new Promise<T>((_resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out in ${ms}ms.`));
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

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

export const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length >= 2) return names[0][0] + names[1][0];
  return names[0][0];
};

export const sortByDate = <T extends { date: string | Date }>(array: T[]) =>
  array.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
