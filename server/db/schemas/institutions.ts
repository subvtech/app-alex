import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const institutions = pgTable('institution', {
  id: serial('id').primaryKey(),
  cnpj: text('cnpj').unique().notNull(),
  name: text('name').unique().notNull(),
  socialName: text('social_name').unique().notNull(),
  acronym: text('acronym').unique().notNull(),
  sector: text('sector').unique().notNull(),
  // cover: media
});

export const institutionRelations = relations(institutions, ({ many }) => ({
  users: many(userToInstitution),
}));

export const userToInstitution = pgTable(
  'user_to_institution',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    institutionId: integer('intitution_id')
      .notNull()
      .references(() => institutions.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.institutionId] }),
  }),
);

export const userToInstitutionRelations = relations(
  userToInstitution,
  ({ one }) => ({
    user: one(users, {
      fields: [userToInstitution.userId],
      references: [users.id],
    }),
    institution: one(institutions, {
      fields: [userToInstitution.institutionId],
      references: [institutions.id],
    }),
  }),
);
