import type { Class } from './class.model';
import type { LearningPlan } from './learningPlan.model';
import type { Task } from './task.model';
import type { Version } from './version.model';

export interface ClassesLearningPlan {
  id: number;
  class: Class;
  learningplan: LearningPlan;
  version: Version;
  tasks: Task[];
}
