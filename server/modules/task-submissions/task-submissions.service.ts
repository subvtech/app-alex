import db from '@@/server/lib/drizzle';
import { taskSubmissions, TaskSubmissions } from './task-submissions.schema';

type taskSubmissions = Omit<TaskSubmissions, 'id'>;

export const taskSubmission = async (params: taskSubmissions) => {
  return await db
    .insert(taskSubmissions)
    .values({
      taskMemberId: params.taskMemberId,
      submission: params.submission,
      justification: params.justification,
      grade: params.grade,
      subimittedAt: params.subimittedAt,
      evaluatedAt: params.evaluatedAt,
    })
    .onConflictDoNothing();
};
