import {
  Strapi4ResponseSingle,
  Strapi4ResponseMany,
} from '@nuxtjs/strapi/dist/runtime/types';
import { ValueOf } from './learningPlan.model';

export const TaskStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  IN_PROGRESS: 'in_progress',
  EVALUATION: 'evaluation',
  DONE: 'done',
} as const;

export const TaskAssign = {
  ALL: 'all',
  SPECIFC: 'specific',
} as const;

export interface Task {
  id: number;
  title: string;
  description: string;
  status: ValueOf<typeof TaskStatus>;
  blocks: Block[];
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  start_at: Date;
  deadline_at: Date;
  contract_address: string;
  tags: string;
  trail: Strapi4ResponseSingle<Trail>;
  assign_to: ValueOf<typeof TaskAssign>;
  deliverable_description: any;
  task_members: Strapi4ResponseMany<TaskMember>;
}
