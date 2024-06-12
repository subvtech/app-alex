import { relations } from 'drizzle-orm';
import {
  integer,
  json,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { taskMembersMessages } from './task-members-messages.schema';
import { taskMembers } from './task-members.schema';

export const taskSubmissions = pgTable('task_submission', {
  id: serial('id').primaryKey(),
  taskMemberId: integer('task_member_id')
    .references(() => taskMembers.id)
    .notNull(),
  submission: json('submission'),
  justification: text('justification'),
  grade: real('grade'),
  subimittedAt: timestamp('submitted_at', { mode: 'date' }),
  evaluatedAt: timestamp('evaluated_at', { mode: 'date' }),
});

export const taskSubmissionRelations = relations(
  taskSubmissions,
  ({ many }) => ({ taskMembersMessage: many(taskMembersMessages) }),
);
