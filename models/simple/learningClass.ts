export interface LearningClass {
  id: number;
  name: string;
  in_charge_member: User;
  meeting_schedules: LearningPlanScheduleSimple[];
  learningplan: LearningPlanSimple;
  invitation_links: InvitationLinkSimple[];
  learning_plan_members: LearningPlanMemberSimple[];
}
