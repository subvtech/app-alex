export interface TrailSimple {
  id: number;
  title: string;
  hidden: boolean;
  order: number;
  description: string;
  cover_image: Upload;
  learning_structure: LearningPlanStructureSimple;
  partners: LearningPlanMemberSimple[];
  contributions: any[];
  structures: StructureSimple[];
  tasks: any[];
}
