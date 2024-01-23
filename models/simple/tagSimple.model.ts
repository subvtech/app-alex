export interface TagSimple {
  id: number;
  text: string;
  verified: boolean;
  verified_date: Date;
  verified_by?: string;
  isPublic: boolean;
  isGeneral: boolean;
  learningplans: LearningPlanSimple;
}
