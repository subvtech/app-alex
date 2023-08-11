import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
import { Block } from './block.model';
import { LearningPlan } from './learningPlan.model';
import { Version } from './version.model';

export interface Structure {
  id: number;
  version: string;
  learningplan?: Strapi4ResponseSingle<LearningPlan>;
  time: Number;
  blocks: Strapi4ResponseMany<Block>;
  versioning: Version;
  updatedAt: string;
}
