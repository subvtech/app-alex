import { useQuery } from '@tanstack/vue-query';
const strapiClient = useStrapiClient();
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
