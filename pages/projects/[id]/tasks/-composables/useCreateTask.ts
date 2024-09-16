import { QueryClient, useMutation } from '@tanstack/vue-query';
import { TaskSimple } from '~/models/simple/taskSimple.model';
import { KanbanColumnTask } from '../-types';
import { SprintsResponse } from './useSprints';

const { create } = useStrapiUtils();
const strapi = useStrapi();

type CreateTaskPayload = {
  learningPlanId: number;
  position: number;
  title: string;
  organization: TaskSimple['organization'];
  parentTask?: number;
  sprint?: number;
};

export const useCreateTask = (learninplanId: Ref<number>, queryClient: QueryClient) =>
  useMutation({
    async mutationFn({ learningPlanId, position, title, organization, parentTask, sprint }: CreateTaskPayload) {
      console.log(sprint);
      const task = await create<TaskSimple & { learningplan: number }>('tasks', {
        allowed_editor_plugins: '',
        can_change_from_review: false,
        can_submit_after_deadline: false,
        learningplan: learningPlanId,
        position,
        status: 'draft',
        submission_description: '',
        submission_required: false,
        title,
        parent_task: parentTask,
        sprint,
        organization,
      });
      return task.data as TaskSimple;
    },
    onSuccess(data) {
      queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          backlog: [...oldData.backlog, data],
        };
      });
    },
  });

type DeleteTaskPayload = {
  id: number;
};
export const useDeleteTask = (learninplanId: Ref<number>, queryClient: QueryClient) =>
  useMutation({
    mutationFn({ id }: DeleteTaskPayload) {
      return strapi.delete('tasks', id);
    },
    onSuccess(_, variables) {
      queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          backlog: oldData.backlog
            .filter((task) => task.id !== variables.id)
            .map((task) => ({ ...task, tasks: task.tasks?.filter((task) => task.id !== variables.id) })),
        };
      });
    },
  });

type UpdateTaskPayload = {
  id: number;
  status: TaskSimple['status'];
  position: number;
  title?: string;
};
export const useUpdateTask = () =>
  useMutation({
    mutationFn({ id, position, status, title }: UpdateTaskPayload) {
      return strapi.update('tasks', id, {
        title,
        status,
        position,
      });
    },
  });

type CreateSprintTaskPayload = {
  learningPlanId: number;
  position: number;
  title: string;
  organization: TaskSimple['organization'];
  parentTask?: number;
  sprintId: number;
  kanbanColumnId: number;
};
export const useCreateKanbanTask = (learninplanId: Ref<number>, queryClient: QueryClient) =>
  useMutation({
    async mutationFn({
      learningPlanId,
      position,
      title,
      organization,
      parentTask,
      sprintId,
      kanbanColumnId,
    }: CreateSprintTaskPayload) {
      const task = await create<TaskSimple & { learningplan: number; sprint: number }>('tasks', {
        allowed_editor_plugins: '',
        can_change_from_review: false,
        can_submit_after_deadline: false,
        learningplan: learningPlanId,
        position,
        status: 'draft',
        submission_description: '',
        submission_required: false,
        title,
        parent_task: parentTask,
        organization,
        sprint: sprintId,
      });
      const kanbanColumnTask = await create('kanban-column-tasks', {
        sprint: sprintId,
        task: task.data.id,
        kanban_column: kanbanColumnId,
        vertical_position: position,
      });
      return kanbanColumnTask.data as unknown as KanbanColumnTask;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
    },
  });
