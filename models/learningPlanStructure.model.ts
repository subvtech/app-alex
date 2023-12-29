import {
  Strapi4ResponseSingle,
  Strapi4ResponseMany,
} from '@nuxtjs/strapi/dist/runtime/types';

export enum learningPlanScructureType {
  STANDARD = 'standard',
  STUDENT = 'student',
}

export interface learningPlanStructure {
  id: number;
  title: string;
  type: learningPlanScructureType;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  trails: Strapi4ResponseMany<Trail>;
}
