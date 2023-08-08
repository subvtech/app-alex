import { ClassesLearningPlan } from './classesLearningPlan.model';
import { ClassesUser } from './classesUser.model';

export interface Class {
  id: number;
  name: string;
  default: Boolean;
  active: Boolean;
  start_at: Date;
  end_at: Date;
  author: string;
  classes_learning_plans: ClassesLearningPlan[];
  classes_users: ClassesUser[];
}
