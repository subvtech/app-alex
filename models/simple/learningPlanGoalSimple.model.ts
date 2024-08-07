import { LearningPlanSimple } from './learningPlanSimple.model';
import { LearningPlanGoalVerbSimple } from './learningPlanGoalVerb.modal';

export interface LearningPlanGoalSimple {
  id: number;
  description: string;
  learningplan: LearningPlanSimple;
  verb: LearningPlanGoalVerbSimple;
}
