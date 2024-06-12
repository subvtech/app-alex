import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { medias } from '../medias/medias.schema';
import { learningPlanGroupMembers } from '../learning-plan-group-members/learning-plan-group-members.schema';
import { learningPlans } from '../learning-plans/learning-plans.schema';
import { classes } from '../classes-folder/classes.schema';

export const learningPlanGroups = pgTable('learning-plan-groups', {
  id: serial('id').primaryKey(),
  classId: integer('class_id')
    .references(() => classes.id)
    .notNull(),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  title: text('title'),
  imageId: integer('image_id').references(() => medias.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlanGroupsRelations = relations(
  learningPlanGroups,
  ({ one, many }) => ({
    learningPlan: one(learningPlans, {
      fields: [learningPlanGroups.learningPlanId],
      references: [learningPlans.id],
    }),
    groupMembers: many(learningPlanGroupMembers),
    learningClass: one(classes, {
      fields: [learningPlanGroups.classId],
      references: [classes.id],
    }),
    image: one(medias, {
      fields: [learningPlanGroups.imageId],
      references: [medias.id],
    }),
  }),
);

export type LearningPlanGroup = typeof learningPlanGroups.$inferSelect;
