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
import { invitationLinks } from './invitation-link';
import { learningPlanMeetingSchedule } from './learning-plan-meeting-schedule';
import { medias } from './medias';
import { learningPlanStructures } from './learning-plan-structures';
import { learningPlanMedias } from './learning-plan-medias';
import { learningGoals } from './learning-goals';
import { tags } from './tags';
import { tasks } from './tasks';

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
  coverImageId: integer('cover_image_id').references(() => medias.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlansRelations = relations(
  learningPlans,
  ({ many, one }) => ({
    members: many(learningPlanMembers),
    classes: many(classes),
    // projects (auto relacionamento)
    // course (auto relacionamento)
    groups: many(learningPlanGroups),
    task: many(tasks),
    invitationLinks: many(invitationLinks),
    schedules: many(learningPlanMeetingSchedule),
    coverImage: one(medias, {
      fields: [learningPlans.coverImageId],
      references: [medias.id],
    }),
    learningStructures: many(learningPlanStructures),
    medias: many(learningPlanMedias),
    tags: many(tags),
    learningGoals: many(learningGoals),
  }),
);

export type LearningPlan = typeof learningPlans.$inferSelect;
