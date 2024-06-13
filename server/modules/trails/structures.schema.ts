import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { blocks } from './blocks.schema';
import { trails } from './trails.schema';

export const structures = pgTable('structre', {
  id: serial('id').primaryKey(),
  trailId: integer('trail_id')
    .references(() => trails.id)
    .notNull(),
  time: integer('time'),
  version: text('version'),
});

export const structureRelations = relations(structures, ({ one, many }) => ({
  trail: one(trails, {
    fields: [structures.trailId],
    references: [trails.id],
  }),
  blocks: many(blocks),
}));

export type Structures = typeof structures.$inferSelect;
