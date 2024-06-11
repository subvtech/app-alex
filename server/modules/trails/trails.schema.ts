import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { LPMembersToTrails } from '../learning-plans/learning-plan-members.schema';
import { learningPlanStructures } from '../learning-plans/learning-plan-structures.schema';
import { medias } from '../medias/medias.schema';
import { tasks } from '../tasks/tasks.schema';

import { structures } from './structures.schema';
import { trailContributions } from './trail-contributions.schema';

export const trails = pgTable('trails', {
  id: serial('id').primaryKey(),
  title: text('title'),
  hidden: boolean('hidden').default(false),
  order: integer('order'),
  description: text('description'),
  coverImageId: integer('cover_image_id').references(() => medias.id),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  learningStructureId: integer('learning_structure_id').references(
    () => learningPlanStructures.id,
  ),
});

export const trailsRelations = relations(trails, ({ one, many }) => ({
  learningStructure: one(learningPlanStructures, {
    fields: [trails.learningStructureId],
    references: [learningPlanStructures.id],
  }),
  coverImage: one(medias, {
    fields: [trails.coverImageId],
    references: [medias.id],
  }),
  learningPlanMember: many(LPMembersToTrails),
  structures: many(structures),
  trailContribution: many(trailContributions),
  task: many(tasks),
}));

export type Trail = typeof trails.$inferSelect;
