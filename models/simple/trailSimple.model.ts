export interface TrailSimple {
  id: number;
  title: string;
  visible: boolean;
  order: number;
  learning_structure: LearningPlanStructureSimple;
  partners: LearningPlanMemberSimple[];
  contribuitions: any[];
  structures: StructureSimple;
  tasks: any[];
}
