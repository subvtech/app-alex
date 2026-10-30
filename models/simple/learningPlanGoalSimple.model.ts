import type { LearningPlanSimple } from './learningPlanSimple.model';
import type { LearningPlanGoalVerbSimple } from './learningPlanGoalVerb.modal';

export interface LearningPlanGoalSimple {
  id: number;
  description: string;
  learningplan: LearningPlanSimple;
  verb: LearningPlanGoalVerbSimple;
}
export const LearningPlanGoalSimple = {};

