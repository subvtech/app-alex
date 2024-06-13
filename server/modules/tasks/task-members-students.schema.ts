import { integer, pgEnum, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { taskMembers } from './task-members.schema';

export const roleEnum = pgEnum('role', ['standart', 'in_charge']);

export const taskMembersStudents = pgTable('task_members_students', {
  id: serial('id').primaryKey(),
  taskMember: integer('task_member_id').references(() => taskMembers.id),
  // studentMember: é do LP members ?
  role: roleEnum('role'),
});

export const taskMembersStudentsRelations = relations(
  taskMembersStudents,
  () => ({}),
);

export type TaskMembersStudents = typeof taskMembersStudents.$inferSelect;
