import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
export interface Block {
  id: number;
  type: string;
  data: any;
  order: number;
  tunes: any;
  structure: Strapi4ResponseMany<Structure>;
}
