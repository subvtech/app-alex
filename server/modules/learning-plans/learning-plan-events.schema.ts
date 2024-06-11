import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { learningPlanMembers } from './learning-plan-members.schema';

export const learningPlanEvents = pgTable('learning_plan_events', {
  id: serial('id').primaryKey(),
  member: integer('learning_plan_member').references(
    () => learningPlanMembers.id,
  ),
  message: text('message'),
});

export const learningPlanEventsRelations = relations(
  learningPlanEvents,
  ({ one }) => ({
    member: one(learningPlanMembers, {
      fields: [learningPlanEvents.member],
      references: [learningPlanMembers.id],
    }),
  }),
);
