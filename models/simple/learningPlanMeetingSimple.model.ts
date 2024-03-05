export interface LearningPlanMeetingSimple {
  date: string;
  schedule: LearningPlanScheduleSimple;
  is_expired: boolean;
  earliest?: boolean; // Only Front
}
