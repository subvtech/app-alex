export interface FieldSimple {
  id: number;
  text: string;
  verified_by?: number;
  isPublic: boolean;
  learningplans: LearningPlanSimple;
}
