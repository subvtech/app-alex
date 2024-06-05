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
import { trailContributions } from './trail-contributions';
import { learningPlanStructures } from './learning-plan-structures';

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
  classId: integer('class_id').references(() => classes.id),
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
    learningPlanStructure: one(learningPlanStructures),
    // partnerTrail:
    learningPlanGroupMembers: many(learningPlanGroupMembers),
    trailContributions: many(trailContributions),
    // TaskMember
    inChargeClasses: many(classes, { relationName: 'inChargeMember' }),
    learningClass: one(classes, {
      fields: [learningPlanMembers.classId],
      references: [classes.id],
      relationName: 'learningClass',
    }),
  }),
);

export type LearningPlanMember = typeof learningPlanMembers.$inferSelect;
