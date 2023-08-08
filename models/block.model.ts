import { Structure } from './structure.model';

export interface Block {
  id: number;
  type: string;
  data: Object;
  order: Number;
  tunes: Object;
  structure: Structure;
}
