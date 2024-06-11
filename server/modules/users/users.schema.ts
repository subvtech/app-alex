import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { accounts } from '../accounts/accounts.schema';
import { userToInstitution } from '../institutions/institutions.schema';
import { learningGoalVerbs } from '../learning-plans/learning-goal-verbs.schema';
import { learningPlanMembers } from '../learning-plans/learning-plan-members.schema';
import { medias } from '../medias/medias.schema';
import { tags } from '../tags/tags.schema';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  cpf: text('name'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  image: text('image'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  avatarId: text('avatar_id'),
  coverId: text('cover_id'),
  username: text('username'),
  password: text('password'),
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

export type UserInsert = typeof users.$inferInsert;
