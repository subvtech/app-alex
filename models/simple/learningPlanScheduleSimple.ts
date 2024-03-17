import { LearningPlanSimple } from './learningPlanSimple.model';

interface DefaultLearningPlanScheduleSimple {
  id: number;
  interval: 0 | 1 | 7 | 14 | 30;
  startDate: string;
  endDate: string;
  name: string;
  learningplan: LearningPlanSimple;
  meetings: LearningPlanMeetingSimple[];
  learning_class: LearningClass;
  type: 'onsite' | 'online';
}
interface OnsiteLearningPlanScheduleSimple {
  type: 'onsite';
  location: string;
}
interface OnlineLearningPlanScheduleSimple {
  type: 'online';
  link: string;
}
export type LearningPlanScheduleSimple = DefaultLearningPlanScheduleSimple &
  (OnsiteLearningPlanScheduleSimple | OnlineLearningPlanScheduleSimple);
