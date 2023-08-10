import { Structure } from './structure.model';

export interface Block {
  id: number;
  type: string;
  data: any;
  order: any;
  tunes: any;
  downloaded: boolean;
  structure: Structure;
}
