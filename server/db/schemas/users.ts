import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { learningPlanMembers } from './learning-plan-members';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  password: text('password'),
});

export const learningPlansRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  learningPlanMembers: many(learningPlanMembers),
}));

export type User = typeof users.$inferSelect;
