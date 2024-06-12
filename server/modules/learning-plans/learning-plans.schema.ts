import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { medias } from '../medias/medias.schema';
import { tagsToLearningPlans } from '../tags/tags.schema';
import { tasks } from '../tasks/tasks.schema';

import { invitationLinks } from '../invitation-link/invitation-link.schema';
import { learningGoals } from '../learning-goals/learning-goals.schema';
import { learningPlanGroups } from '../learning-plan-groups/learning-plan-groups.schema';
import { learningPlanMedias } from '../learning-plan-medias/learning-plan-medias.schema';
import { learningPlanMeetingSchedule } from '../learning-plan-meetings/learning-plan-meeting-schedule.schema';
import { learningPlanMembers } from '../learning-plan-members/learning-plan-members.schema';
import { learningPlanStructures } from '../learning-plan-structure/learning-plan-structures.schema';
import { classes } from '../classes-folder/classes.schema';

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
    tags: many(tagsToLearningPlans),
    learningGoals: many(learningGoals),
  }),
);

export type LearningPlan = typeof learningPlans.$inferSelect;
