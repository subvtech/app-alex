import { integer, pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { learningPlanMembers } from './learning-plan-members';
import { taskMembers } from './task-members';
import { taskSubmissions } from './task-submissions';

export const taskMembersMessages = pgTable('task_members_messages', {
  id: serial('id').primaryKey(),
  learningPlanMemberId: integer('learning_plan_member_id').references(
    () => learningPlanMembers.id,
  ),
  taskMemberId: integer('task_member_id').references(() => taskMembers.id),
  taskSubmissionId: integer('task_submission_id').references(
    () => taskSubmissions.id,
  ),
  sentAt: timestamp('sent_at', { mode: 'date' }),
  message: text('message'),
  // audio:
  // responseToMessage:
});

export const taskMembersMessagesRelations = relations(
  taskMembersMessages,
  ({ one, many }) => ({

  }),
);
