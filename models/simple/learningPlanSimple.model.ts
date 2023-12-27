import { Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';

const LearningPlanType = {
  COURSE: 'course',
  PROJECT: 'project',
  COURSE_PROJECT: 'course_project',
} as const;

type ValueOf<T> = T[keyof T];

export interface LearningPlanSimple {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  media: Strapi4ResponseMany<Media>;
  type: ValueOf<typeof LearningPlanType>;
  cover_image: Upload;
  slug: string;
  class_name: string;
  archive_at: string;
  projects: any[];
  courses: any[];
  members: LearningPlanMemberSimple[];
  learning_structure: any;
  groups: any[];
  tasks: any[];
  tags: any[];
  invite_enable: boolean;
  invitation_links: InvitationLink[];
  learning_goals: any;
  schedules: any[];
  hidden: boolean;
  details: any;
}
