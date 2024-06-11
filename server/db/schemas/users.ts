import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { userToInstitution } from './institutions';
import { learningGoalVerbs } from './learning-goal-verbs';
import { learningPlanMembers } from './learning-plan-members';
import { medias } from './medias';
import { tags } from './tags';

import { accounts } from '~/server/modules/accounts/accounts.schema';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  avatarId: text('avatar_id'),
  coverId: text('cover_id'),
  password: text('password').notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  learningPlanMembers: many(learningPlanMembers),
  learningGoalVerb: one(learningGoalVerbs),
  tags: many(tags),
  institutions: many(userToInstitution),
  avatarId: one(medias, {
    fields: [users.avatarId],
    references: [medias.id],
  }),
  coverId: one(medias, {
    fields: [users.coverId],
    references: [medias.id],
  }),
}));

export type User = typeof users.$inferSelect;
