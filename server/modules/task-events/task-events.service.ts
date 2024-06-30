import db from '@@/server/lib/drizzle';
import { TaskEvents, taskEvents } from './task-events.schema';

type taskEvents = Omit<TaskEvents, 'id'>;

export const createTaskEvent = async (params: taskEvents) => {
  return await db.insert(taskEvents).values({
    taskId: params.taskId,
    taskMemberId: params.taskMemberId,
    event: params.event,
    created_at: new Date(),
  });
};
