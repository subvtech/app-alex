import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { learningPlanMembers } from '../learning-plan-members/learning-plan-members.schema';
import { taskEvents } from '../task-events/task-events.schema';
import { tasks } from './tasks.schema';

export const statusEnum = pgEnum('type', [
  'to_do',
  'in_progress',
  'in_review',
  'done',
]);

export const taskMembers = pgTable('task_members', {
  id: serial('id').primaryKey(),
  learningPlanMemberId: integer('learning_plan_member_id').references(
    () => learningPlanMembers.id,
  ),
  status: statusEnum('status'),
  canSubmitAfterDeadLine: boolean('can_submit_after_deadLine').default(false),
  startAt: timestamp('start_at', { mode: 'date' }),
  finishAt: timestamp('finish_at', { mode: 'date' }),
  lastSubmitionAt: timestamp('last_submition_at', { mode: 'date' }),
});

export const taskMemberRelations = relations(taskMembers, ({ one, many }) => ({
  tasks: many(tasks),
  events: many(taskEvents),
  learningPlanMembers: one(learningPlanMembers, {
    fields: [taskMembers.learningPlanMemberId],
    references: [learningPlanMembers.id],
  }),
}));

export type TaskMembers = typeof taskMembers.$inferSelect;
