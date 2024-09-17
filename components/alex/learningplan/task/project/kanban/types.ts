import { Colors } from './column/Header.vue';
import { Accept } from './column/index.vue';

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
