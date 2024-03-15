import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';
import { ClassSimple } from './classSimple.model';

export interface LearningPlanGroupSimple {
  id: number;
  title: string;
  image: Media;
  learningplan: LearningPlanSimple;
  group_members: Strapi4ResponseSingle<learningPlanGroupMember>;
  task_members: any[];
  learning_class?: ClassSimple;
}
