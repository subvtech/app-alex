import type { Colors } from './column/Header.vue';
import type { Accept } from './column/index.vue';

export interface GenericItem<U> {
  group: string;
  raw: U;
}

export interface Column<U = object> {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<GenericItem<U>> | null;
  disable?: boolean;
}

// Runtime shims for Vite ESM compatibility
export const GenericItem = {} as any;
export const Column = {} as any;
