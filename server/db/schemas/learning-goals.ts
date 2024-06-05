import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlans } from './learning-plans';
import { learningGoalVerbs } from './learning-goal-verbs';

export const learningGoals = pgTable('learning-goal', {
  id: serial('id').primaryKey(),
  verbId: integer('verb_id').references(() => learningGoalVerbs.id),
  learningPlanId: integer('learning_plan_id').references(
    () => learningPlans.id,
  ),
  description: text('description'),
});

export const learningGoalRelations = relations(learningGoals, ({ one }) => ({
  learningPlan: one(learningPlans, {
    fields: [learningGoals.learningPlanId],
    references: [learningPlans.id],
  }),
  learningGoalVerb: one(learningGoalVerbs),
  // tasks
}));
