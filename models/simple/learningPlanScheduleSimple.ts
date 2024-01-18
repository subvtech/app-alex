export interface LearningPlanScheduleSimple {
  interval: number;
  startDate: Date;
  endDate: Date;
  name: string;
  learningplan: LearningPlanSimple;
  meetings: LearningPlanMeetingSimple;
}
