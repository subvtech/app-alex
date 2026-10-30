import type { ClassSimple } from './classSimple.model';
import type { LearningPlanGroupMemberSimple } from './learningPlanGroupMemberSimple.model';

export interface LearningPlanGroupSimple {
  id: number;
  title: string;
  image: Media;
  learningplan: LearningPlanSimple;
  group_members: LearningPlanGroupMemberSimple[];
  task_members?: TaskMember[];
  learning_class?: ClassSimple;
}
export const LearningPlanGroupSimple = {};

