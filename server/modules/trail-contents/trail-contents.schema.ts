import { relations } from 'drizzle-orm';
import { integer, json, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { trails } from '../trails/trails.schema';

export const trailContents = pgTable('trail_content', {
  id: serial('id').primaryKey(),
  trailId: integer('trail_id')
    .references(() => trails.id)
    .notNull(),
  time: integer('time'),
  version: text('version'),
  blocks:
    json('blocks').$type<
      { id: string; type: string; order: number; data: any; tunes: any }[]
    >(),
});

export const structureRelations = relations(trailContents, ({ one }) => ({
  trail: one(trails, {
    fields: [trailContents.trailId],
    references: [trails.id],
  }),
}));

export type TrailContents = typeof trailContents.$inferSelect;
