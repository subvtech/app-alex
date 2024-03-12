import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export interface LearningPlanGoalVerb {
  text: string;
  user: Strapi4ResponseSingle<User>;
  general: boolean;
}
