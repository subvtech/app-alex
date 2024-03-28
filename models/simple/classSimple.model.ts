import { InvitationLinkSimple } from './InvitationLinkSimple.model';
import { LearningPlanGroupSimple } from './learningPlanGroupSimple.model';
import { LearningPlanMemberSimple } from './learningPlanMemberSimple.model';
import { LearningPlanScheduleSimple } from './learningPlanScheduleSimple';
import { LearningPlanSimple } from './learningPlanSimple.model';

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
