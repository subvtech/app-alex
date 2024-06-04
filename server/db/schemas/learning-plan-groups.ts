import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { learningPlans } from './learning-plans';
import { classes } from './classes';
import { learningPlanGroupMembers } from './learning-plan-group-members';

export const learningPlanGroups = pgTable('learning-plan-groups', {
  id: serial('id').primaryKey(),
  class_id: integer('class_id')
    .references(() => classes.id)
    .notNull(),
  learningPlan_id: integer('learningPlan_id')
    .references(() => learningPlans.id)
    .notNull(),
  title: text('title'),
  // TODO image: media
});

export const learningPlanGroupsRelations = relations(
  learningPlanGroups,
  ({ one, many }) => ({
    learningPlan: one(learningPlans, {
      fields: [learningPlanGroups.learningPlan_id],
      references: [learningPlans.id],
    }),
    groupMembers: many(learningPlanGroupMembers),
    // task_members:
    learningClass: one(classes, {
      fields: [learningPlanGroups.class_id],
      references: [classes.id],
    }),
  }),
);
