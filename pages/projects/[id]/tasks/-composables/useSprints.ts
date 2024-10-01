import { useQuery, QueryClient, useMutation } from '@tanstack/vue-query';
const strapiClient = useStrapiClient();
const strapi = useStrapi();
const { find } = useStrapiUtils();
export type Sprint = {
  expanded?: any;
} & SprintSimple;

export type SprintsResponse = {
  backlog: TaskSimple[];
  sprints: Sprint[];
};
export const useGetSprints = (learninplanId: Ref<number>) =>
  useQuery({
    queryKey: ['sprints', learninplanId],
    queryFn: async ({ queryKey }) =>
      await strapiClient<SprintsResponse>(`/learningplans/${queryKey[1]}/sprint-backlog`),
    initialData: { backlog: [], sprints: [] },
  });

export const useGetSprintGroupings = (learninplanId: Ref<number>) =>
  useQuery({
    queryKey: ['groupings', learninplanId],
    queryFn: async ({ queryKey }) => {
      const response = await find<TaskSimple>('tasks', {
        filters: {
          learningplan: {
            id: queryKey[1],
          },
          organization: {
            $in: ['epic', 'story'],
          },
          sprint: {
            id: {
              $null: true,
            },
          },
        },
        populate: {
          parent_task: true,
          tasks: {
            filters: {
              organization: { $in: ['story', 'epic'] },
            },

            populate: {
              parent_task: true,
              tasks: {
                populate: {
                  parent_task: true,
                },
                organization: { $in: ['story', 'epic'] },
              },
            },
          },
        },
      });
      const storysMap = new Map();
      const epicsMap = new Map();
      response.data.forEach((task) => {
        if (!storysMap.get(task.id) || !epicsMap.get(task.id)) {
          (task.organization === 'story' ? storysMap : epicsMap).set(task.id, task);
          task.tasks?.forEach((subTask) => {
            (subTask.organization === 'story' ? storysMap : epicsMap).set(subTask.id, task);
          });
        }
      });
      return {
        epics: Array.from(epicsMap.values()),
        histories: Array.from(storysMap.values()),
      };
    },
    initialData: { epics: [], histories: [] },
  });

export const useDeleteSprint = (
  learninplanId: Ref<number>,
  queryClient: QueryClient,
  setMessage: Function,
  t: Function,
) => {
  return useMutation({
    mutationFn: async (sprintId: number) => {
      await strapi.delete('sprints', sprintId);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
      setMessage(t('pages.projects.sprints.actions.deleted_success'), 'success', true);
    },
    onError() {
      setMessage(t('pages.projects.sprints.actions.deleted_error'), 'error', true);
    },
  });
};

interface EditingSprint {
  id: number;
  move: 'up' | 'down';
}

interface MutationVariables {
  editingSprint: EditingSprint;
  sprints: SprintSimple[];
}

const swapSprints = (sprints: SprintSimple[], editingSprint: EditingSprint) => {
  const editingIndex = sprints.findIndex((sprint) => sprint.id === editingSprint.id);
  const targetIndex = editingSprint.move === 'up' ? editingIndex - 1 : editingIndex + 1;

  if (targetIndex < 0 || targetIndex >= sprints.length) {
    return sprints;
  }

  [sprints[editingIndex], sprints[targetIndex]] = [sprints[targetIndex], sprints[editingIndex]];

  sprints.forEach((sprint, index) => {
    sprint.order = index;
  });

  return sprints;
};

export const useMoveSprint = (
  learninplanId: Ref<number>,
  queryClient: QueryClient,
  setMessage: Function,
  t: Function,
) => {
  return useMutation<void, unknown, MutationVariables>({
    mutationFn: async ({ editingSprint, sprints }) => {
      const updatedSprints = swapSprints([...sprints], editingSprint);

      await strapiClient<SprintsResponse>(`/sprints/sort`, {
        method: 'POST',
        body: updatedSprints,
      });
    },
    onMutate({ editingSprint, sprints }) {
      queryClient.setQueryData(['sprints', learninplanId], (oldData: SprintsResponse) => {
        const newSprints = swapSprints([...sprints], editingSprint);
        return {
          ...oldData,
          sprints: newSprints,
        };
      });
    },
    onSuccess() {
      setMessage(t('pages.projects.sprints.actions.moved_success'), 'success', true);
    },
    onError() {
      queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
      setMessage(t('pages.projects.sprints.actions.moved_error'), 'error', true);
    },
  });
};
