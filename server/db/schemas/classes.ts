import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  pgEnum,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { learningPlanMembers } from './learning-plan-members';
import { learningPlans } from './learning-plans';
import { learningPlanGroups } from './learning-plan-groups';
import { invitationLinks } from './invitation-link';
import { learningPlanMeetingSchedule } from './learning-plan-meeting-schedule';

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
