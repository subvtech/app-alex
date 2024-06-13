import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { learningPlans } from '../learning-plans/learning-plans.schema';
import { users } from '../users/users.schema';

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  text: text('text'),
  isPublic: boolean('is_public'),
  isGeneral: boolean('is_general'),
  verified: boolean('verified'),
  verifiedDate: timestamp('verified_date', { mode: 'date' }),
  verifiedBy: integer('verified_by'),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  tagsToLearningPlans: many(tagsToLearningPlans),
  tagsToUsers: many(tagsToUsers),
}));

export const tagsToLearningPlans = pgTable(
  'tags_to_learning_plans',
  {
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id),
    learningPlanId: integer('learning_plan_id')
      .notNull()
      .references(() => learningPlans.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.learningPlanId] }),
  }),
);

export const usersToGroupsRelations = relations(
  tagsToLearningPlans,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagsToLearningPlans.tagId],
      references: [tags.id],
    }),
    learningPlan: one(learningPlans, {
      fields: [tagsToLearningPlans.learningPlanId],
      references: [learningPlans.id],
    }),
  }),
);

export const tagsToUsers = pgTable(
  'tags_to_users',
  {
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.userId] }),
  }),
);

export const tagsToUsersRelations = relations(tagsToUsers, ({ one }) => ({
  tag: one(tags, {
    fields: [tagsToUsers.tagId],
    references: [tags.id],
  }),
  user: one(users, {
    fields: [tagsToUsers.userId],
    references: [users.id],
  }),
}));

export type Tags = typeof tags.$inferSelect;
