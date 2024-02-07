export interface LearningPlanScheduleSimple {
  id: number;
  interval: 0 | 1 | 7 | 14 | 30;
  startDate: Date;
  endDate: Date;
  name: string;
  learningplan: LearningPlanSimple;
  meetings: LearningPlanMeetingSimple[];
}
