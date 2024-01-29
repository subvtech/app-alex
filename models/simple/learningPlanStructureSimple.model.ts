export enum LearningPlanScructureSimpleType {
  STANDARD = 'standard',
  STUDENT = 'student',
}

export interface LearningPlanStructureSimple {
  id: number;
  title: string;
  type: LearningPlanScructureSimpleType;
  learningplan: LearningPlan;
  trails: TrailSimple[];
}
