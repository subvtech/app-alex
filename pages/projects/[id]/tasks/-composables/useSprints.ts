import { useQuery } from '@tanstack/vue-query';
import { Kanban } from '../-types';
const strapiClient = useStrapiClient();

export interface Sprint {
  id: number;
  kanban: Kanban;
  order: number;
  title: string;
  tasks: TaskSimple[];
  start_at: string;
  end_at: string;
  expanded?: any;
}

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
