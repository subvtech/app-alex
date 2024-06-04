import { relations } from 'drizzle-orm';
import { pgTable, serial, text, pgEnum, integer } from 'drizzle-orm/pg-core';
import { learningPlanMembers } from './learning-plans-members';
import { learningPlans } from './learning-plans';

export const typeEnum = pgEnum('type', ['course', 'project', 'course_project']);

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: text('title').notNull(),
  learningPlanId: integer('learning_plan_id').references(
    () => learningPlans.id,
  ),
  inChargeMemberId: integer('in_charge_member_id').references(
    () => learningPlanMembers.id,
  ),
});

export const classesRelations = relations(classes, ({ one }) => ({
  learningPlan: one(learningPlans, {
    fields: [classes.learningPlanId],
    references: [learningPlans.id],
  }),
  inChargeMember: one(learningPlanMembers, {
    fields: [classes.learningPlanId],
    references: [learningPlanMembers.id],
    relationName: 'inChargeMember',
  }),
}));

export type LearningPlan = typeof classes.$inferSelect;
