import { integer, pgTable, serial, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { medias } from '../medias/medias.schema';
import { learningPlanMembers } from '../learning-plans/learning-plan-members.schema';

import { taskMembers } from './task-members.schema';
import { taskSubmissions } from './task-submissions.schema';

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
  audioId: text('audio_id'),
  responseToMessage: integer('response_to_message'), // .references(
  //   () => taskMembersMessages.id,
  // ),
});

export const taskMembersMessagesRelations = relations(
  taskMembersMessages,
  ({ one }) => ({
    learninPlanMemberId: one(learningPlanMembers, {
      fields: [taskMembersMessages.learningPlanMemberId],
      references: [learningPlanMembers.id],
    }),
    audio: one(medias, {
      fields: [taskMembersMessages.audioId],
      references: [medias.id],
    }),
    responseToMessage: one(taskMembersMessages, {
      fields: [taskMembersMessages.responseToMessage],
      references: [taskMembersMessages.id],
    }),
    taskSubmission: one(taskSubmissions, {
      fields: [taskMembersMessages.taskSubmissionId],
      references: [taskSubmissions.id],
    }),
  }),
);
