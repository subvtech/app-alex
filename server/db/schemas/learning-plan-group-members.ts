import { integer, pgEnum, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlanMembers } from './learning-plan-members';
import { learningPlanGroups } from './learning-plan-groups';

export const LpGroupMemberRoleEnum = pgEnum('roleEnum', [
  'standart',
  'in_charge',
]);

export const learningPlanGroupMembers = pgTable('learning-plan-group-members', {
  id: serial('id').primaryKey(),
  groups: integer('groups')
    .references(() => learningPlanGroups.id)
    .notNull(),
  studentMember: integer('studentMember')
    .references(() => learningPlanMembers.id)
    .notNull(),
  role: LpGroupMemberRoleEnum('roleEnum'),
});

export const learningPlanGroupMembersRelation = relations(
  learningPlanGroupMembers,
  ({ one }) => ({
    learningPlanGroup: one(learningPlanGroups, {
      fields: [learningPlanGroupMembers.groups],
      references: [learningPlanGroups.id],
    }),
    learningPlanMember: one(learningPlanMembers, {
      fields: [learningPlanGroupMembers.studentMember],
      references: [learningPlanMembers.id],
    }),
  }),
);
