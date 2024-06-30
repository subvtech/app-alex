import db from '@@/server/lib/drizzle';
import { TaskMembers, taskMembers } from './task-members.schema';

type taskMembers = Omit<TaskMembers, 'id'>;

export const createTaskMember = async (params: taskMembers) => {
  return await db
    .insert(taskMembers)
    .values({
      status: params.status,
      canSubmitAfterDeadLine: params.canSubmitAfterDeadLine,
      learningPlanMemberId: params.learningPlanMemberId,
      startAt: params.startAt,
      finishAt: params.finishAt,
      lastSubmitionAt: params.lastSubmitionAt,
    })
    .onConflictDoNothing();
};
