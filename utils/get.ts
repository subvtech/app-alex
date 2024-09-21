import { curry } from './curry';

interface GetFn {
  <R = unknown>(a: string | string[]): (b: object) => R;
  <R = unknown>(a: string | string[], b: object): R;
}

/**
 * A curried function to safely retrieve nested properties from an object.
 *
 * @template R - The expected return type of the retrieved value.
 * @param {string | string[]} path - The path to the desired property. Can be a string (dot-separated) or an array of keys.
 * @param {unknown} data - The object to retrieve the value from.
 * @returns {R} The value at the specified path, or undefined if the path doesn't exist.
 *
 * @example
 * const obj = { a: { b: { c: 1 } } };
 * get('a.b.c', obj); // Returns 1
 * get(['a', 'b', 'c'], obj); // Returns 1
 * get('a.b.d', obj); // Returns undefined
 */
export const get = curry(<R = never>(path: string | string[], data: unknown): R => {
  const keys = Array.isArray(path) ? path : path.split(/[\].[]/).filter(Boolean);
  return keys.reduce((acc, key) => acc?.[key as keyof typeof acc], data) as R;
}) as GetFn;
