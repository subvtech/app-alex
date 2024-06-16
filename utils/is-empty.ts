import { typeOf } from './type-of';

export function isEmpty(value: unknown): boolean {
  switch (typeOf(value)) {
    case 'array':
    case 'object':
      return !Object.keys(value as object).length;

    case 'map':
    case 'set':
      return !(value as Set<never>).size;

    case 'string':
      return !(value as string).trim().length;
  }

  return !value;
}
