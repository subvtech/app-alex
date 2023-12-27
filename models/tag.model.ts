import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export interface Tag {
  id: number;
  text: string;
  verified: boolean;
  verified_date: Date;
  verified_by: string;
  isPublic: boolean;
  isGeneral: boolean;
  learningplans: Strapi4ResponseSingle<LearningPlan>;
}
