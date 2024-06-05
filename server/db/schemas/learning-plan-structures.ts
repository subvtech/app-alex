import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { learningPlans } from './learning-plans';
import { learningPlanMembers } from './learning-plan-members';
import { trails } from './trails';

export const StructureTypeEnum = pgEnum('type', ['standard', 'student']);

export const learningPlanStructures = pgTable('learning-plan-structures', {
  id: serial('id').primaryKey(),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  memberId: integer('member_id').references(() => learningPlanMembers.id),
  title: text('title'),
  type: StructureTypeEnum('name'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  // TODO image: media
});

export const learningPlanStructuresRelations = relations(
  learningPlanStructures,
  ({ one, many }) => ({
    learningPlan: one(learningPlans, {
      fields: [learningPlanStructures.learningPlanId],
      references: [learningPlans.id],
    }),
    member: one(learningPlanMembers, {
      fields: [learningPlanStructures.memberId],
      references: [learningPlanMembers.id],
    }),
    trails: many(trails),
  }),
);

export type LearningPlanStructure = typeof learningPlanStructures.$inferSelect;
