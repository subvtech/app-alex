import { LearningPlanMemberSimple } from './learningPlanMemberSimple.model';

export enum learningPlanGroupMemberRolesSimple {
  STANDARD = 'standard',
  IN_CHARGE = 'in_charge',
}

export interface LearningPlanGroupMemberSimple {
  id: number;
  group: LearningPlanGroupSimple;
  student_member: LearningPlanMemberSimple;
  role: learningPlanGroupMemberRolesSimple;
}
