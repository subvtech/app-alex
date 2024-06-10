import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { about } from './about';

export const aboutFuncionality = pgTable('about_funcionality', {
  id: serial('id').primaryKey(),
  aboutId: integer('about_id').references(() => about.id),
  name: text('name'),
  // icon: media,
  // type?
});

export const aboutFuncionalityRelations = relations(
  aboutFuncionality,
  ({ one }) => ({
    about: one(about, {
      fields: [aboutFuncionality.aboutId],
      references: [about.id],
    }),
  }),
);
