import type { ClassesLearningPlan } from './classesLearningPlan.model';
import type { ClassesUser } from './classesUser.model';

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

// Runtime shim for Vite ESM compatibility
export const Class = {} as any;
