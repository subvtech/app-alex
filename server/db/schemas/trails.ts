import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlanStructures } from './learning-plan-structures';
import { medias } from './medias';

export const trails = pgTable('trails', {
  id: serial('id').primaryKey(),
  title: text('title'),
  hidden: boolean('hidden').default(false),
  order: integer('order'),
  description: text('description'),
  coverImageId: integer('cover_image_id').references(() => medias.id),
  learningStructureId: integer('learning_structure_id').references(
    () => learningPlanStructures.id,
  ),
});

export const trailsRelations = relations(trails, ({ one }) => ({
  learningStructure: one(learningPlanStructures, {
    fields: [trails.learningStructureId],
    references: [learningPlanStructures.id],
  }),
  coverImage: one(medias, {
    fields: [trails.coverImageId],
    references: [medias.id],
  }),
}));

export type Trail = typeof trails.$inferSelect;
