export const __ = Symbol('curry');

type SameLength<T extends any[]> = Extract<{ [K in keyof T]: any }, any[]>;

export type Curried<A extends any[], R> = <P extends Partial<A>>(
  ...args: P
) => P extends A
  ? R
  : A extends [...SameLength<P>, ...infer S]
  ? S extends any[]
    ? Curried<S, R>
    : never
  : never;

const cat = (prev: unknown[], next: unknown[]) => {
  const arr = prev.reduce((res: unknown[], arg) => {
    return [...res, arg === __ ? next.shift() : arg];
  }, []);

  return [...(arr as unknown[]), ...next];
};

/**
 * Implementation of curry function inspired by the solution from Stack Overflow.
 * This implementation allows for partial application and placeholder arguments.
 *
 * @see {@link https://stackoverflow.com/a/63905763/2528550} for the original implementation
 *
 * @example
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curriedAdd = curry(add);
 * console.log(curriedAdd(1)(2)(3)); // 6
 * console.log(curriedAdd(1, 2)(3)); // 6
 * console.log(curriedAdd(1, __, 3)(2)); // 6
 */
export function curry<A extends unknown[], R>(fn: Fn<A, R>): Curried<A, R> {
  return function curried(...args: any[]): any {
    if (args.includes(__) || args.length < fn.length) {
      return (...next: unknown[]) => curried(...cat(args, next));
    }

    return fn(...(args as any));
  };
}
