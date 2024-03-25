import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
export interface LearningClass {
  name: string;
  in_charge_member: string;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  invitation_links: Strapi4ResponseMany<InvitationLink>;
  meeting_schedules: Strapi4ResponseMany<LearningPlanSchedule>;
  learning_plan_members: Strapi4ResponseMany<learningPlanMember>;
}
