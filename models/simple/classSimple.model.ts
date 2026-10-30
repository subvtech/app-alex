import type { InvitationLinkSimple } from './InvitationLinkSimple.model';
import type { LearningPlanGroupSimple } from './learningPlanGroupSimple.model';
import type { LearningPlanMemberSimple } from './learningPlanMemberSimple.model';
import type { LearningPlanScheduleSimple } from './learningPlanScheduleSimple';
import type { LearningPlanSimple } from './learningPlanSimple.model';

export interface ClassSimple {
  id: number;
  name: string;
  in_charge_member: LearningPlanMemberSimple;
  learning_plan_members?: LearningPlanMemberSimple[];
  invitation_links?: InvitationLinkSimple[];
  learningplan: LearningPlanSimple;
  learning_plan_groups?: LearningPlanGroupSimple[];
  meeting_schedules?: LearningPlanScheduleSimple[];
}
export const ClassSimple = {};

