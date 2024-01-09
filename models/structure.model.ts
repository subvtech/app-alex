import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
export interface Structure {
  id: number;
  time: Number;
  version: string;
  blocks: Strapi4ResponseMany<Block>;
  trails: Strapi4ResponseMany<Trail>;
}
