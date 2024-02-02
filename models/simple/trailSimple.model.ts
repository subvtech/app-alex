export interface TrailSimple {
  id: number;
  title: string;
  hidden: boolean;
  order: number;
  description: string;
  cover_image: Upload;
  learning_structures: LearningPlanStructureSimple;
  partners: LearningPlanMemberSimple[];
  contribuitions: any[];
  structures: StructureSimple[];
  tasks: any[];
}
