import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

import { learningPlanGroups } from '../learning-plan-groups/learning-plan-groups.schema';
import { learningPlanMembers } from '../learning-plan-members/learning-plan-members.schema';

export const GroupMemberRoleEnum = pgEnum('role', ['standard', 'in_charge']);

export const learningPlanGroupMembers = pgTable('learning_plan_group_members', {
  id: serial('id').primaryKey(),
  groupId: integer('group_id')
    .references(() => learningPlanGroups.id)
    .notNull(),
  studentMemberId: integer('student_member_id')
    .references(() => learningPlanMembers.id)
    .notNull(),
  role: GroupMemberRoleEnum('role').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

export const learningPlanGroupMembersRelation = relations(
  learningPlanGroupMembers,
  ({ one }) => ({
    learningPlanGroup: one(learningPlanGroups, {
      fields: [learningPlanGroupMembers.groupId],
      references: [learningPlanGroups.id],
    }),
    studentMember: one(learningPlanMembers, {
      fields: [learningPlanGroupMembers.studentMemberId],
      references: [learningPlanMembers.id],
    }),
  }),
);

export type LearningPlanGroupMembers =
  typeof learningPlanGroupMembers.$inferSelect;
