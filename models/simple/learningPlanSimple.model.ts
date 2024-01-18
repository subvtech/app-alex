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
  message: string | null;
  projects: any[];
  courses: any[];
  members: LearningPlanMemberSimple[];
  learning_structures: LearningPlanStructureSimple[];
  groups: LearningPlanGroupSimple[];
  tasks: any[];
  tags: TagSimple[];
  invite_enabled: boolean;
  invitation_duration: number;
  invitation_links: InvitationLinkSimple[];
  learning_goals: any;
  schedules: LearningPlanScheduleSimple[];
  hidden: boolean;
  details: any | null;
}
