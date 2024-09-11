import { useQuery } from '@tanstack/vue-query';
import { SprintTask } from '../-types';
const strapiClient = useStrapiClient();
export type SprintsResponse = {
  backlog: SprintTask[];
  sprints: SprintTask[];
};
export const useGetSprints = (learninplanId: Ref<number>) =>
  useQuery({
    queryKey: ['sprints', learninplanId],
    queryFn: async ({ queryKey }) =>
      await strapiClient<SprintsResponse>(`/learningplans/${queryKey[1]}/sprint-backlog`),
    initialData: { backlog: [], sprints: [] },
  });
