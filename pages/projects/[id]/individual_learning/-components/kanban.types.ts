export type Accept<T> =
  | true
  | string[]
  | (({ source, dest, payload }: { source: HTMLElement; dest: HTMLElement; payload: T }) => boolean);
