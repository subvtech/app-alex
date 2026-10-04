import type { ClassesLearningPlan } from './classesLearningPlan.model';
import type { LearningPlan } from './learningPlan.model';
import type { Structure } from './structure.model';
import type { Tag } from './tag.model';

export interface Version {
  id: number;
  tag: Tag;
  learningplan: LearningPlan;
  classes_learning_plans: ClassesLearningPlan[];
  structures: Structure[];
}
export const Version = {};

