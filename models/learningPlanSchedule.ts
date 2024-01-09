import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';

export interface LearningPlanSchedule {
  interval: number;
  startDate: Date;
  endDate: Date;
  name: string;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  meetings: Strapi4ResponseMany<LearningPlanMeeting>;
}
