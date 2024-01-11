import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export enum learningPlanGroupMemberRoles {
  STANDARD = 'standard',
  IN_CHARGE = 'in_charge',
}

export interface learningPlanGroupMember {
  id: number;
  learningplan: Strapi4ResponseSingle<learningPlanGroupMember>;
  student_member: Strapi4ResponseSingle<learningPlanMember>;
  role: learningPlanGroupMemberRoles;
}
