import { Class } from './class.model';
import { LearningPlan } from './learningPlan.model';
import { Task } from './task.model';
import { Version } from './version.model';

export interface ClassesLearningPlan {
  id: number;
  class: Class;
  learningplan: LearningPlan;
  version: Version;
  tasks: Task[]
}
