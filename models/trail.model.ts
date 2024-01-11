import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
export interface Trail {
  id: number;
  title: string;
  visible: boolean;
  order: number;
  learning_structure: Strapi4ResponseSingle<learningPlanStructure>;
  partners: Strapi4ResponseMany<learningPlanMember>;
  contribuitions: Strapi4ResponseMany<TrailContribuition>;
  structures: Strapi4ResponseMany<Structure>;
  tasks: Strapi4ResponseMany<Task>;
}
