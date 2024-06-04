import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  boolean,
  integer,
  json,
  date,
} from 'drizzle-orm/pg-core';
import { learningPlanMembers } from './learning-plan-members';
import { classes } from './classes';
import { learningPlanGroups } from './learning-plan-groups';

export const typeEnum = pgEnum('type', ['course', 'project', 'course_project']);

export const learningPlans = pgTable('learning-plans', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  startDate: date('start_date', { mode: 'date' }),
  endDate: date('end_date', { mode: 'date' }),
  archivedAt: timestamp('archived_at', { mode: 'date' }),
  type: typeEnum('type'),
  coverImage: text('cover_image'),
  slug: text('slug'),
  className: text('class_name'),
  inviteEnabled: boolean('invite_enabled').default(true),
  invitationDuration: integer('invitation_duration'),
  hidden: boolean('hidden'),
  details: json('details'),
  message: text('message'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlansRelations = relations(learningPlans, ({ many }) => ({
  members: many(learningPlanMembers),
  classes: many(classes),
  // media
  // projects (auto relacionamento)
  // course (auto relacionamento)
  groups: many(learningPlanGroups),
  // task
  // invitation link
  // schedules
  // learning structure
  // tag
  // learning goal
}));

export type LearningPlan = typeof learningPlans.$inferSelect;
