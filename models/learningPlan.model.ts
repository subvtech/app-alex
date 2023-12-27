import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
import { Structure } from './structure.model';
import { Tag } from './tag.model';
import { User } from './user.model';
import { Upload } from './upload.model';

// FIX ME: CORRECT KEYS BUT SOME VALUES ARE INCORRECT.
export interface LearningPlan {
  id: number;
  type: 'course' | 'project' | 'course_project ';
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  author: Strapi4ResponseSingle<User>;
  cover_image: Strapi4ResponseSingle<Upload>;
  members: Strapi4ResponseMany<User>;
  hidden: boolean;
  learning_goals: Strapi4ResponseMany<any>;
  groups: Strapi4ResponseMany<any>;
  projects: Strapi4ResponseMany<any>;
  course: Strapi4ResponseMany<any>;
  tasks: Strapi4ResponseMany<any>;
  media: Strapi4ResponseMany<any>;
  schedules: Strapi4ResponseMany<any>;
  invitation_links: Strapi4ResponseSingle<any>;
  invite_enable: boolean;
  learning_structure?: Strapi4ResponseMany<Structure>;
  tags: Strapi4ResponseMany<Tag>;
}
