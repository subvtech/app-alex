// Gets the return of stringLiterals and convert this => ('goiaba' | 'maconha')[] to 'goiaba' | 'maconha'
export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export const useUtils = () => {
  // Iinstead return of string[], gonna return a type of each element of array ex:
  // ['goiaba' | 'maconha'] =>  type = ('goiaba' | 'maconha')[]
  function literalArray<T extends string>(...args: T[]): T[] {
    return args;
  }

  return {
    literalArray,
  };
};
