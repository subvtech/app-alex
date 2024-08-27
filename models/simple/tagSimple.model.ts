export interface TagSimple {
  id: number;
  text: string;
  verified: boolean;
  verified_date: Date;
  verified_by?: number;
  isPublic: boolean;
  isGeneral: boolean;
  learningplans?: LearningPlanSimple;
  tasks?: TaskSimple;
}
