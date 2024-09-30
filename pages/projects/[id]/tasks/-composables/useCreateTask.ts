import { QueryClient, useMutation } from '@tanstack/vue-query';
import { TaskSimple } from '~/models/simple/taskSimple.model';
import { SprintsResponse } from './useSprints';

const { create } = useStrapiUtils();
const strapi = useStrapi();
const strapiClient = useStrapiClient();
type CreateTaskPayload = {
  learningPlanId: number;
  position: number;
  title: string;
  organization: TaskSimple['organization'];
  parentTask?: number;
  sprint?: SprintSimple;
  group?: boolean;
};

type CreateTaskResponse = Omit<TaskSimple, 'parent_task' | 'sprint'> & {
  learningplan: number;
  kanban_column: number;
  parent_task?: number;
  sprint?: number;
  group?: boolean;
};

export const useCreateTask = (
  learninplanId: Ref<number>,
  queryClient: QueryClient,
  setMessage: Function,
  t: Function,
) =>
  useMutation({
    async mutationFn({ learningPlanId, position, title, organization, parentTask, sprint }: CreateTaskPayload) {
      const task = await create<CreateTaskResponse>('tasks', {
        allowed_editor_plugins: '',
        can_change_from_review: false,
        can_submit_after_deadline: false,
        learningplan: learningPlanId,
        position,
        type: 'group',
        status: 'draft',
        submission_description: '',
        submission_required: false,
        title,
        parent_task: parentTask,
        sprint: sprint?.id || undefined,
        organization,
        group: true,
      });

      const taskWithSprintId = {
        ...task.data,
        sprint_id: sprint?.id || undefined,
      };

      return taskWithSprintId as TaskSimple & { sprint_id?: number };
    },
    onSuccess(data) {
      queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        if (data.sprint_id) {
          return {
            ...oldData,
            sprints: oldData.sprints.map((sprint) => {
              if (sprint.id === data.sprint_id) {
                return {
                  ...sprint,
                  tasks: [...sprint.tasks, data],
                };
              }
              return sprint;
            }),
          };
        } else {
          return {
            ...oldData,
            backlog: [...oldData.backlog, data],
          };
        }
      });
      setMessage(t('pages.projects.tasks.actions.created_success', { item: data.title }), 'success', true);
    },
    onError(_, variables) {
      setMessage(t('pages.projects.tasks.actions.created_error', { item: variables.title }), 'error', true);
    },
  });

type DeleteTaskPayload = {
  title: string;
  id: number;
  sprintId?: number;
  hasChildren?: boolean;
  organization: TaskSimple['organization'];
};

export const useDeleteTask = (
  learninplanId: Ref<number>,
  queryClient: QueryClient,
  setMessage: Function,
  t: Function,
) =>
  useMutation({
    mutationFn({ id, organization, hasChildren }: DeleteTaskPayload) {
      if (hasChildren) {
        setMessage(t(`pages.projects.tasks.actions.delete_${organization}_has_children`), 'warning', true, false, true);
        return Promise.reject(new Error('Item has children'));
      }
      return strapi.delete('tasks', id);
    },
    onSuccess(_, variables) {
      queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
        if (!oldData) {
          return oldData;
        }
        return {
          ...oldData,
          sprints: oldData.sprints.map((sprint) => {
            if (sprint.id === variables.sprintId) {
              return {
                ...sprint,
                tasks: sprint.tasks.filter((task) => task.id !== variables.id),
              };
            }
            return sprint;
          }),
          backlog: oldData.backlog.filter((task) => task.id !== variables.id),
        };
      });
      setMessage(t('pages.projects.tasks.actions.deleted_success', { item: variables.title }), 'success', true);
    },
    onError(error, variables) {
      if (error.message === 'Item has children') {
        throw error;
      }
      setMessage(t('pages.projects.tasks.actions.deleted_error', { item: variables.title }), 'error', true);
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
type UpdateTaskStatusPayload = {
  id: number;
  sprint: number;
};
export const useUpdateTaskStatus = () =>
  useMutation({
    mutationFn({ id, sprint }: UpdateTaskStatusPayload) {
      return strapiClient(`/tasks/${id}/update-kanban-task`, {
        method: 'PUT',
        body: {
          data: {
            sprint,
          },
        },
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
      const task = await create<CreateTaskResponse>('tasks', {
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
        kanban_column: kanbanColumnId,
      });
      return task.data.kanban_column;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
    },
  });
