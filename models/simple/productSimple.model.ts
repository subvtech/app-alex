export interface ProductSimple {
  id: number;
  text: string;
  isPublic: boolean;
  verified_date: Date;
  verified_by?: number;
  learningplans?: LearningPlanSimple;
}
