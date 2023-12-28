import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';

export enum Roles {
  STUDENT = 'student',
  PARTNER = 'partner',
  FACILITATOR = 'facilitator',
}

export enum Status {
  PENDING_INVITATION = 'pending_invitation',
  JOINED = 'joined',
}

export interface learningPlanMember {
  id: number;
  learningplan: Strapi4ResponseSingle<LearningPlan>;
  user: Strapi4ResponseMany<User>;
  email: string;
  role: Roles;
  joined_at: Date;
  status: Status;
  learning_structure: Strapi4ResponseSingle<learningPlanStructure>;
  partner_trails: Strapi4ResponseMany<Trail>;
  trail_contribuitions: Strapi4ResponseMany<TrailContribuition>;
  group_members: Strapi4ResponseMany<any>;
  task_members: Strapi4ResponseMany<TaskMember>;
}
