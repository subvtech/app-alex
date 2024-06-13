import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { invitationLinks } from '../invitation-link/invitation-link.schema';
import { learningPlanGroups } from '../learning-plan-groups/learning-plan-groups.schema';
import { learningPlanMeetingSchedule } from '../learning-plan-meetings/learning-plan-meeting-schedule.schema';
import { learningPlanMembers } from '../learning-plan-members/learning-plan-members.schema';
import { learningPlans } from '../learning-plans/learning-plans.schema';

export const typeEnum = pgEnum('type', ['course', 'project', 'course_project']);

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  learningPlanId: integer('learning_plan_id').references(
    () => learningPlans.id,
  ),
  inChargeMemberId: integer('in_charge_member_id'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const classesRelations = relations(classes, ({ one, many }) => ({
  learningPlan: one(learningPlans, {
    fields: [classes.learningPlanId],
    references: [learningPlans.id],
  }),
  inChargeMember: one(learningPlanMembers, {
    fields: [classes.inChargeMemberId],
    references: [learningPlanMembers.id],
    relationName: 'inChargeMember',
  }),
  meetingSchedules: many(learningPlanMeetingSchedule),
  learningPlanMembers: many(learningPlanMembers, {
    relationName: 'learningClass',
  }),
  learningPlanGroups: many(learningPlanGroups),
  invitationLinks: many(invitationLinks),
}));

export type Classes = typeof classes.$inferSelect;
