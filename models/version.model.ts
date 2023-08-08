import { ClassesLearningPlan } from './classesLearningPlan.model';
import { LearningPlan } from './learningPlan.model';
import { Structure } from './structure.model';
import { Tag } from './tag.model';

export interface Version {
  id: number;
  tag: Tag;
  learningplan: LearningPlan;
  classes_learning_plans: ClassesLearningPlan[]
  structures: Structure[];
}
