import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tasks } from './tasks';
import { taskEvents } from './task-events';

export const statusEnum = pgEnum('type', [
  'to_do',
  'in_progress',
  'in_review',
  'done',
]);

export const taskMembers = pgTable('task_members', {
  id: serial('id').primaryKey(),
  status: statusEnum('status'),
  canSubmitAfterDeadLine: boolean('can_submit_after_deadLine').default(false),
  startAt: timestamp('start_at', { mode: 'date' }),
  finishAt: timestamp('finish_at', { mode: 'date' }),
  lastSubmitionAt: timestamp('last_submition_at', { mode: 'date' }),
});

export const taskMemberRelations = relations(taskMembers, ({ many }) => ({
  tasks: many(tasks),
  events: many(taskEvents),
}));
