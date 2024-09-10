import { useMutation, useQuery } from '@tanstack/vue-query';
import { Kanban, KanbanColumn, KanbanStatusType, SprintTask } from '../-types';

export type BoardsResponse = {
  boards: KanbanColumn[];
} & Kanban;

const strapiClient = useStrapiClient();
const { create } = useStrapiUtils();
const strapi = useStrapi();

export const useGetSprints = (learninplanId: Ref<number>) =>
  useQuery({
    queryKey: ['sprints', learninplanId],
    queryFn: async ({ queryKey }) =>
      await strapiClient<{
        backlog: SprintTask[];
        sprints: SprintTask[];
      }>(`/learningplans/${queryKey[1]}/sprint-backlog`),
    initialData: { backlog: [], sprints: [] },
  });

export const useGetKanban = (learninplanId: Ref<number>, sprint: Ref<SprintTask | undefined>, enabled: Ref<boolean>) =>
  useQuery({
    queryKey: ['kanban', learninplanId, sprint],
    queryFn: async ({ queryKey }) => {
      if (!sprint.value) {
        return;
      }
      const res = await strapiClient<BoardsResponse>(
        `/learningplans/${queryKey[1]}/sprints/${sprint.value.id}/task-board`,
      );
      return res;
    },
    enabled,
  });

type CreateKanbanPayload = {
  columns: Pick<KanbanColumn, 'title' | 'position'>[];
  sprintId: number;
};
export const useCreateKanban = () =>
  useMutation({
    mutationFn({ columns, sprintId }: CreateKanbanPayload) {
      return strapiClient(`/sprints/${sprintId}/create-new-version`, {
        method: 'POST',
        body: {
          data: {
            columns,
          },
        },
      });
    },
  });

type CreateColumnPayload = {
  title: string;
  position: number;
  statusType: ValueOf<typeof KanbanStatusType>;
  kanbanId: number;
};
export const useCreateColumn = () =>
  useMutation({
    mutationFn({ title, position, kanbanId, statusType }: CreateColumnPayload) {
      return create('kanban-columns', {
        title,
        kanban: kanbanId,
        position,
        status_type: statusType,
      });
    },
  });

type UpdateColumnPayload = {
  id: number;
  title: string;
  position: number;
};
export const useUpdateColumn = () =>
  useMutation({
    mutationFn({ title, position, id }: UpdateColumnPayload) {
      return strapi.update('kanban-columns', id, {
        title,
        position,
      });
    },
  });

type DeleteColumnPayload = {
  id: number;
};
export const useDeleteColumn = () =>
  useMutation({
    mutationFn({ id }: DeleteColumnPayload) {
      return strapi.delete('kanban-columns', id);
    },
  });

type ReorderColumnsPayload = {
  kanbanId: number;
  columns: Pick<KanbanColumn, 'id' | 'position' | 'status_type'>[];
};
export const useReorderColumns = () =>
  useMutation({
    mutationFn({ columns, kanbanId }: ReorderColumnsPayload) {
      return strapiClient(`/kanbans/${kanbanId}/reorder-columns`, {
        method: 'PUT',
        body: {
          data: {
            columns,
          },
        },
      });
    },
  });
