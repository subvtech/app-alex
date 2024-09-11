import { QueryClient, useMutation } from '@tanstack/vue-query';
import { TaskSimple } from '~/models/simple/taskSimple.model';
import { SprintsResponse } from './useSprints';

type CreateTaskPayload = {
  learningPlanId: number;
  position: number;
  title: string;
};

const { create } = useStrapiUtils();
const strapi = useStrapi();
export const useCreateTask = (learninplanId: Ref<number>, queryClient: QueryClient) =>
  useMutation({
    async mutationFn({ learningPlanId, position, title }: CreateTaskPayload) {
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
          backlog: oldData.backlog.filter((task) => task.id !== variables.id),
        };
      });
    },
  });

type UpdateTaskPayload = {
  id: number;
  status: TaskSimple['status'];
  position: number;
};
export const useUpdateTask = () =>
  useMutation({
    mutationFn({ id, position, status }: UpdateTaskPayload) {
      return strapi.update('tasks', id, {
        status,
        position,
      });
    },
  });
