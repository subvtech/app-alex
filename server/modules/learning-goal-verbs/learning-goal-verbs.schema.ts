import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { users } from '../users/users.schema';
import { learningGoals } from '../learning-goals/learning-goals.schema';

export const learningGoalVerbs = pgTable('learning-goal-verbs', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  learningGoalId: integer('learning_goal_id'),
  descripton: text('descripton'),
  general: boolean('general').default(true),
});

export const learningGoalVerbRelations = relations(
  learningGoalVerbs,
  ({ one }) => ({
    userId: one(users, {
      fields: [learningGoalVerbs.userId],
      references: [users.id],
    }),
    learningGoal: one(learningGoals, {
      fields: [learningGoalVerbs.learningGoalId],
      references: [learningGoals.id],
    }),
  }),
);

export type LearningGoalVerbs = typeof learningGoalVerbs.$inferSelect;
