import { integer, json, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { structures } from './structures.schema';

export const blocks = pgTable('blocks', {
  id: serial('id').primaryKey(),
  structureId: integer('structure_id').references(() => structures.id),
  taskId: integer('task_id'),
  type: text('type'),
  order: integer('order'),
  data: json('data'),
  tunes: json('tunes'),
});

export const blockRelations = relations(blocks, ({ one }) => ({
  structure: one(structures, {
    fields: [blocks.structureId],
    references: [structures.id],
  }),
  // tasks
}));
