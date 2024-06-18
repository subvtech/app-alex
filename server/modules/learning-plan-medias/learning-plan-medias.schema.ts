import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, timestamp } from 'drizzle-orm/pg-core';

import { medias } from '../medias/medias.schema';
import { learningPlans } from '../learning-plans/learning-plans.schema';

export const learningPlanMedias = pgTable(
  'learning_plan_medias',
  {
    learningPlanId: integer('learning_plan_id')
      .notNull()
      .references(() => learningPlans.id),
    mediaId: integer('media_id')
      .notNull()
      .references(() => medias.id),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.learningPlanId, t.mediaId] }),
  }),
);

export const learningPlanMediasRelations = relations(
  learningPlanMedias,
  ({ one }) => ({
    learningPlan: one(learningPlans, {
      fields: [learningPlanMedias.learningPlanId],
      references: [learningPlans.id],
    }),
    media: one(medias, {
      fields: [learningPlanMedias.mediaId],
      references: [medias.id],
    }),
  }),
);

export type LearningPlanMedia = typeof learningPlanMedias.$inferSelect;
