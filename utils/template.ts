import { curry } from './curry';
import { get } from './get';

export const template = curry((str?: string, obj: object = {}) => {
  return str?.replace?.(/{{\s*(.+?)\s*}}/g, (_, k) => get(k, obj) ?? '') ?? str;
});
