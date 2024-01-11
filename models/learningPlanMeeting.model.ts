import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export interface LearningPlanMeeting {
  date: Date;
  schedule: Strapi4ResponseSingle<LearningPlanSchedule>;
  is_expired: boolean;
}
