import { ClassSimple } from './classSimple.model';
import { LearningPlanGroupMemberSimple } from './learningPlanGroupMemberSimple.model';

export interface LearningPlanGroupSimple {
  id: number;
  title: string;
  image: Media;
  learningplan: LearningPlanSimple;
  group_members: LearningPlanGroupMemberSimple[];
  task_members: any[];
  learning_class?: ClassSimple;
}
