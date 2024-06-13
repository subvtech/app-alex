import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  json,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';

import { learningPlanMembers } from '../learning-plan-members/learning-plan-members.schema';
import { trails } from '../trails/trails.schema';

export const trailContributions = pgTable('trail-contribution', {
  id: serial('id').primaryKey(),
  studentMember: integer('id')
    .references(() => learningPlanMembers.id)
    .notNull(),
  trailId: integer('id')
    .references(() => trails.id)
    .notNull(),
  title: text('title'),
  blocked: boolean('blocked').default(false),
  contribution: json('contribution'),
  highlighted: boolean('highlighted').default(false),
  highlightedOrder: integer('highlighted_order'),
});

export const trailContributionRelations = relations(
  trailContributions,
  ({ one }) => ({
    trail: one(trails, {
      fields: [trailContributions.trailId],
      references: [trails.id],
    }),
    studentMember: one(learningPlanMembers, {
      fields: [trailContributions.studentMember],
      references: [learningPlanMembers.id],
    }),
  }),
);

export type TrailContributions = typeof trailContributions.$inferSelect;
