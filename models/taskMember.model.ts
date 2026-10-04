import type { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

export const TaskMemberStatus = {
  TO_DO: 'to_do',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
} as const;

export const TaskMemberRole = {
  STANDARD: 'standard',
  IN_CHARGE: 'in_charge',
} as const;

type ValueOf<T> = T[keyof T];

export interface TaskMember {
  id: number;
  task: Strapi4ResponseSingle<LearningPlan>;
  student_member: Strapi4ResponseSingle<learningPlanMember>;
  status: ValueOf<typeof TaskMemberStatus>;
  Role: ValueOf<typeof TaskMemberRole>;
  started_at: Date;
  finished_at: Date;
  in_review_at: Date;
  deliverable: any;
}
export const TaskMember = {};

