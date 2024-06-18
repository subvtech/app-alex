import db from '@@/server/lib/drizzle';
import { Tasks, tasks } from './tasks.schema';

type tasks = Omit<Tasks, 'id'>;

export const createTask = async (params: tasks) => {
  return await db
    .insert(tasks)
    .values({
      taskMemberId: params.taskMemberId,
      trailId: params.trailId,
      learningPlanId: params.learningPlanId,
      title: params.title,
      description: params.description,
      type: params.type,
      status: params.status,
      position: params.position,
      startAt: params.startAt,
      finishAt: params.finishAt,
      archivedAt: params.archivedAt,
      canSubmitAfterDeadLine: params.canSubmitAfterDeadLine,
      allowedEditorPluginJs: params.allowedEditorPluginJs,
      submitionDescription: params.submitionDescription,
      submitionRequired: params.submitionRequired,
    })
    .onConflictDoNothing();
};
