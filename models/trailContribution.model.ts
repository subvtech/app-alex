import type { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import type { learningPlanMember } from './learningPlanMember.model';

export interface TrailContribuition {
  id: number;
  trail: Strapi4ResponseMany<Trail>;
  student_member: Strapi4ResponseMany<learningPlanMember>;
  contribuition: any;
}
export const TrailContribuition = {};

