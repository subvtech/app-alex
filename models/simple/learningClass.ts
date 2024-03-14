export interface LearningClass {
  name: string;
  in_charge_member: string;
  learningplan: LearningPlanSimple;
  invitation_links: InvitationLinkSimple;
  meeting_schedules: LearningPlanScheduleSimple;
  learning_plan_members: LearningPlanMemberSimple;
}
