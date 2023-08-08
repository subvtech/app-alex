import { Block } from 'typescript';
import { Class } from './class.model';
import { ClassesLearningPlan } from './classesLearningPlan.model';
import { LearningPlan } from './learningPlan.model';
import { Version } from './version.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  weight: number;
  begin_at: Date;
  deadline_at: Date;
  classes_learning_plan: ClassesLearningPlan;
  status: string;
  blocks: Block[];
  learningplan: LearningPlan;
}
