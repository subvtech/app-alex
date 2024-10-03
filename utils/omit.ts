import { curry } from './curry';

/**
 * Creates a new object with the specified properties omitted.
 *
 * @param {string | string[]} path - A string or an array of property keys to omit. Can include nested properties using dot notation (e.g., 'user.address.street').
 * @param {object} obj - The source object from which to omit properties.
 * @returns {object} A new object with the specified properties omitted.
 *
 * @example
 * const user = { name: 'John', age: 30, address: { city: 'New York', zip: '10001' } };
 * const result = omit(['age', 'address.zip'], user);
 * // result: { name: 'John', address: { city: 'New York' } }
 *
 * @example
 * const array = [1, 2, 3, 4, 5];
 * const result = omit('[1]', array);
 * // result: [1, 3, 4, 5]
 */
export const omit = curry(function <T extends object>(path: string | string[], target: T) {
  const keys = Array.isArray(path) ? path : [path];

  const _omit = (data: T, path: (string | number)[]): T => {
    const [key, ...rest] = path;

    if (rest.length === 0) {
      return (
        Array.isArray(data)
          ? data.filter((_, idx) => idx !== +key)
          : Object.fromEntries(Object.entries(data).filter(([k]) => k !== key))
      ) as T;
    }

    if (data[key] && typeof data[key] === 'object') {
      return (
        Array.isArray(data)
          ? data.map((item, idx) => (idx === key ? _omit(item, rest) : item))
          : { ...data, [key]: _omit(data[key] as T, rest) }
      ) as T;
    }

    return data;
  };

  return keys.reduce(
    (acc, key) => {
      return _omit(
        acc as T,
        key.split('.').map((att) => {
          const arr = att.match(/^\[?(\d+)\]?$/);
          return arr ? parseInt(arr[1], 10) : att;
        }),
      );
    },
    Array.isArray(target) ? [...target] : { ...target },
  );
});
