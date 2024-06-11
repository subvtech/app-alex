import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlanStructures } from './learning-plan-structures';
import { medias } from './medias';
import { trailContributions } from './trail-contributions';
import { structures } from './structures';
import { LPMembersToTrails } from './learning-plan-members';
import { tasks } from './tasks';

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
