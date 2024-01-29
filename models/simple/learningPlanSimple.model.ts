import { InvitationLinkSimple } from './InvitationLinkSimple.model';

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
  media: MediaSimple[];
  type: ValueOf<typeof LearningPlanType>;
  cover_image: Upload;
  slug: string;
  class_name: string;
  archive_at: string;
  projects: any[];
  courses: any[];
  members: LearningPlanMemberSimple[];
  learning_structures: LearningPlanStructureSimple[];
  groups: LearningPlanGroupSimple[];
  tasks: any[];
  tags: any[];
  invite_enable: boolean;
  invitation_links: InvitationLinkSimple[];
  learning_goals: any;
  schedules: any[];
  hidden: boolean;
  details: any;
}
