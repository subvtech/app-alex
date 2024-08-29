export interface ProductSimple {
  id: number;
  text: string;
  verified_by?: number;
  isPublic: boolean;
  learningplans?: LearningPlanSimple;
}
