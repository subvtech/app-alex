import {
  Strapi4ResponseSingle,
  Strapi4ResponseMany,
} from '@nuxtjs/strapi/dist/runtime/types';

export enum TaskStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  EVALUATION = 'evaluation',
  DONE = 'done',
}

export enum TaskAssign {
  ALL = 'all',
  SPECIFC = 'specific',
}

export interface Task {
  id: number;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  trail: Strapi4ResponseSingle<Trail>;
  deliverable_description: any;
  title: string;
  description: string;
  status: TaskStatus;
  blocks: Block[];
  start_at: Date;
  deadline_at: Date;
  tags: string;
  task_members: Strapi4ResponseMany<TaskMember>;
}
