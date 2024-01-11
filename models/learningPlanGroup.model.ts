import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export interface learningPlanGroup {
  id: number;
  title: string;
  image: Media;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  group_members: Strapi4ResponseSingle<learningPlanGroupMember>;
  task_members: Strapi4ResponseSingle<TaskMember>;
}
