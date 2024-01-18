export interface LearningPlanScheduleSimple {
  id: number;
  interval: number;
  startDate: Date;
  endDate: Date;
  name: string;
  learningplan: LearningPlanSimple;
  meetings: LearningPlanMeetingSimple[];
}
