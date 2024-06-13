import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { taskMembers } from '../tasks/task-members.schema';
import { trailContributions } from '../trail-contributions/trail-contributions.schema';
import { trails } from '../trails/trails.schema';
import { users } from '../users/users.schema';

import { classes } from '../classes-folder/classes.schema';
import { learningPlanEvents } from '../learning-plan-events/learning-plan-events.schema';
import { learningPlanGroupMembers } from '../learning-plan-group-members/learning-plan-group-members.schema';
import { learningPlanStructures } from '../learning-plan-structure/learning-plan-structures.schema';
import { learningPlans } from '../learning-plans/learning-plans.schema';

export const roleEnum = pgEnum('role', [
  'student',
  'partner',
  'facilitator',
  'collaborator',
]);

export const statusEnum = pgEnum('status', ['pending_invitation', 'joined']);

// XXX: default enums https://github.com/drizzle-team/drizzle-orm/issues/2299
export const learningPlanMembers = pgTable('learning-plan-members', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  learningPlanId: integer('learning_plan_id')
    .references(() => learningPlans.id)
    .notNull(),
  email: text('email'),
  joinedAt: timestamp('joined_at', { mode: 'date' }),
  role: roleEnum('role'), // TODO: default to student
  status: statusEnum('status'), // TODO: default to pending_invitation
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
    partnerTrail: many(LPMembersToTrails),
    learningPlanGroupMembers: many(learningPlanGroupMembers),
    trailContributions: many(trailContributions),
    taskMember: many(taskMembers),
    learningPlanEvents: many(learningPlanEvents),
    inChargeClasses: many(classes, { relationName: 'inChargeMember' }),
    learningClass: one(classes, {
      fields: [learningPlanMembers.classId],
      references: [classes.id],
      relationName: 'learningClass',
    }),
  }),
);

export const LPMembersToTrails = pgTable(
  'learning_plan_members_to_trails',
  {
    partnerTrail: integer('partner_trail')
      .notNull()
      .references(() => learningPlanMembers.id),
    trailId: integer('partner')
      .notNull()
      .references(() => trails.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.partnerTrail, t.trailId] }),
  }),
);

export const LPMembersToTrailsRelations = relations(
  LPMembersToTrails,
  ({ one }) => ({
    member: one(learningPlanMembers, {
      fields: [LPMembersToTrails.partnerTrail],
      references: [learningPlanMembers.id],
    }),
    trail: one(trails, {
      fields: [LPMembersToTrails.trailId],
      references: [trails.id],
    }),
  }),
);

export type LearningPlanMember = typeof learningPlanMembers.$inferSelect;
