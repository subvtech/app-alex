import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export interface LearningPlanGoal {
  description: string;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  verb: Strapi4ResponseSingle<LearningPlanGoalVerb>;
}
