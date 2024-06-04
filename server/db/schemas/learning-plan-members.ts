import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';
import { learningPlans } from './learning-plans';
import { users } from './users';
import { classes } from './classes';
import { learningPlanGroupMembers } from './learning-plan-group-members';

export const roleEnum = pgEnum('role', [
  'student',
  'partner',
  'facilitator',
  'collaborator',
]);

export const statusEnum = pgEnum('status', ['pending_invitation', 'joined']);

export const learningPlanMembers = pgTable('learning-plan-members', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  email: text('email'),
  description: text('description'),
  joinedAt: timestamp('joined_at', { mode: 'date' }),
  role: roleEnum('role').default('student'),
  status: statusEnum('status').default('pending_invitation'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlanMembersRelations = relations(
  learningPlanMembers,
  ({ one, many }) => ({
    learningPlan: one(learningPlans, {
      fields: [learningPlanMembers.learningPlanId],
      references: [learningPlans.id],
    }),
    user: one(users, {
      fields: [learningPlanMembers.userId],
      references: [users.id],
    }),
    inChargeClasses: many(classes),
    learningPlanGroupMember: many(learningPlanGroupMembers),
  }),
);

export type LearningPlanMember = typeof learningPlanMembers.$inferSelect;
