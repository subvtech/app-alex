import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { about } from './about';

export const aboutMiniSection = pgTable('about_mini_section', {
  id: serial('id').primaryKey(),
  aboutId: integer('about_id').references(() => about.id),
  title: text('title'),
  description: text('description'),
});

export const aboutMiniSectionRelations = relations(
  aboutMiniSection,
  ({ one }) => ({
    about: one(about, {
      fields: [aboutMiniSection.aboutId],
      references: [about.id],
    }),
  }),
);
