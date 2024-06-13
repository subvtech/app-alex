import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

import { tasks } from '../tasks/tasks.schema';
import { taskMembers } from '../tasks/task-members.schema';

export const taskStatusEventEnum = pgEnum('status', [
  'submission',
  'comment',
  'denied',
  'deadline_student',
  'archive_task',
  'task_info',
]);

export const taskEvents = pgTable('task_events', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').references(() => tasks.id),
  taskMemberId: integer('task_member_id').references(() => taskMembers.id),
  event: taskStatusEventEnum('status'),
  created_at: timestamp('created_at').defaultNow(),
});

export const taskEventRelations = relations(taskEvents, ({ one }) => ({
  task: one(tasks, {
    fields: [taskEvents.taskId],
    references: [tasks.id],
  }),
  member: one(taskMembers, {
    fields: [taskEvents.taskMemberId],
    references: [taskMembers.id],
  }),
}));

export type TaskEvents = typeof taskEvents.$inferSelect;
