import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core';

import { medias } from '../medias/medias.schema';
import { users } from '../users/users.schema';

export const institutions = pgTable('institutions', {
  id: serial('id').primaryKey(),
  cnpj: text('cnpj').unique().notNull(),
  name: text('name').unique().notNull(),
  socialName: text('social_name').unique().notNull(),
  acronym: text('acronym').unique().notNull(),
  sector: text('sector').unique().notNull(),
  coverImageId: integer('cover_image_id').references(() => medias.id),
});

export const userToInstitution = pgTable(
  'user_to_institution',
  {
    userId: text('user_id')
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

export const institutionRelations = relations(
  institutions,
  ({ one, many }) => ({
    userToInstitution: many(userToInstitution, {
      relationName: 'user',
    }),
    coverImageId: one(medias, {
      fields: [institutions.coverImageId],
      references: [medias.id],
    }),
  }),
);

export const userToInstitutionRelations = relations(
  userToInstitution,
  ({ one }) => ({
    user: one(users, {
      fields: [userToInstitution.userId],
      references: [users.id],
      relationName: 'user',
    }),
    institution: one(institutions, {
      fields: [userToInstitution.institutionId],
      references: [institutions.id],
      relationName: 'institution',
    }),
  }),
);

export type Institutions = typeof institutions.$inferSelect;
