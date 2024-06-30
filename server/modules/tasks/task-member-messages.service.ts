import db from '@@/server/lib/drizzle';
import {
  TaskMembersMessage,
  taskMembersMessages,
} from './task-members-messages.schema';

type taskMemberMessage = Omit<TaskMembersMessage, 'id'>;

export const createTaskMemberMessage = async (params: taskMemberMessage) => {
  return await db
    .insert(taskMembersMessages)
    .values({
      learningPlanMemberId: params.learningPlanMemberId,
      message: params.message,
      responseToMessage: params.responseToMessage,
      audioId: params.audioId,
      sentAt: new Date(),
      taskMemberId: params.taskMemberId,
      taskSubmissionId: params.taskSubmissionId,
    })
    .onConflictDoNothing();
};
