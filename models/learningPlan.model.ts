import { Strapi4ResponseMany, Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export const LearningPlanType = {
  COURSE: 'course',
  PROJECT: 'project',
  COURSE_PROJECT: 'course_project',
} as const;

export type ValueOf<T> = T[keyof T];
export interface LearningPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  media: Strapi4ResponseMany<Media>;
  type: ValueOf<typeof LearningPlanType>;
  cover_image: Strapi4ResponseSingle<Upload>;
  slug: string;
  class_name: string;
  archive_at: string;
  projects: Strapi4ResponseMany<LearningPlan>;
  courses: Strapi4ResponseMany<LearningPlan>;
  members: Strapi4ResponseMany<User>;
  learning_structure: Strapi4ResponseSingle<learningPlanStructure>;
  groups: Strapi4ResponseMany<learningPlanGroup>;
  tasks: Strapi4ResponseMany<Task>;
  tags: Strapi4ResponseMany<Tag>;
  message: string;
  institutions: Strapi4ResponseSingle<Institution>;
  invite_enabled: boolean;
  invitation_links: Strapi4ResponseSingle<InvitationLink>;
  learning_goals: Strapi4ResponseMany<LearningPlanGoal>;
  schedules: Strapi4ResponseMany<LearningPlanSchedule>;
  hidden: boolean;
  details: any;
}
