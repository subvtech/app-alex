import { curry } from './curry';
import { isEmpty } from './is-empty';

interface GetFn {
  <R = unknown>(a: string | string[]): (b: object) => R;
  <R = unknown>(a: string | string[], b: object): R;
}

/**
 * https://github.com/developit/dlv
 *
 * TODO: adicionar documentação
 */
export const get = curry((path: string | string[], data: never): unknown => {
  if (isEmpty(path)) return undefined;
  typeof path === 'string' && (path = path.split(/[\].[]/).filter(Boolean));
  for (let i = 0; i < path.length; i++) data = data?.[path[i]];
  return data;
}) as GetFn;
