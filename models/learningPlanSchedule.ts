import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';

export interface LearningPlanSchedule {
  id: number;
  interval: number;
  startDate: Date;
  endDate: Date;
  name: string;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  learning_class: Strapi4ResponseSingle<LearningClass>;
  meetings: Strapi4ResponseMany<LearningPlanMeeting>;
}
