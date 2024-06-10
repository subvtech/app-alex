import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { aboutFuncionality } from './about-functionality';
import { aboutMiniSection } from './about-mini-section';

export const about = pgTable('about', {
  id: serial('id').primaryKey(),
  title: text('title'),
  title2: text('title2'),
  description: text('description'),
  order: integer('order'),
});

export const aboutRelations = relations(about, ({ many }) => ({
  aboutFuncionality: many(aboutFuncionality),
  aboutMiniSection: many(aboutMiniSection),
}));
