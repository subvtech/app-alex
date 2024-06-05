import { boolean, integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { learningGoals } from './learning-goals';

export const learningGoalVerbs = pgTable('learning-goal-verbs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  general: boolean('general').default(true),
});

export const learningGoalVerbRelations = relations(
  learningGoalVerbs,
  ({ one }) => ({
    userId: one(users, {
      fields: [learningGoalVerbs.userId],
      references: [users.id],
    }),
    learningGoal: one(learningGoals),
  }),
);
