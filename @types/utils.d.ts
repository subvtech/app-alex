type Fn<A extends unknown[], R> = (...args: A) => R;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Obj<T = any> = Record<PropertyKey, T>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Constructor<T> = new (...args: any[]) => T;

// https://dev.to/dzey/comment/268bd
type KeyOf<T, K = keyof T> = K extends keyof T & (string | number)
  ? `${K}` | (T[K] extends object ? `${K}.${KeyOf<T[K]>}` : never)
  : never;

type ValueOf<T, K = keyof T> = K extends keyof T & (string | number)
  ? T[K] | (T[K] extends object ? ValueOf<T[K]> : never)
  : never;

type ValuesOf<T extends unknown[]> = [...T][number];
