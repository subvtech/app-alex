import { InvitationLinkSimple } from './InvitationLinkSimple.model';
import { ClassSimple } from './classSimple.model';

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
  archive_at: string | null;
  details: any | null;
  updatedAt: string | null;
  message: string | null;
  cover_image: Upload | null;
  slug: string;
  class_name: string;
  projects: any[];
  courses: any[];
  members: LearningPlanMemberSimple[];
  learning_structures: LearningPlanStructureSimple[];
  groups: LearningPlanGroupSimple[];
  tasks: TaskSimple[];
  tags: TagSimple[];
  invite_enabled: boolean;
  invitation_duration: number;
  invitation_links: InvitationLinkSimple[];
  learning_goals: any;
  schedules: LearningPlanScheduleSimple[];
  hidden: boolean;
  classes: ClassSimple[];
  facilitatorName?: string;
  facilitatorImage?: string;
  institution?: string;
  trails?: number;
  userIsFacilitator?: boolean;
}
