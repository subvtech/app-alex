export interface LearningPlanScheduleSimple {
  id: number;
  interval: 0 | 1 | 7 | 14 | 30;
  startDate: string;
  endDate: string;
  name: string;
  learningplan: LearningPlanSimple;
  meetings: LearningPlanMeetingSimple[];
}
