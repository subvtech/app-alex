import { useQuery } from '@tanstack/vue-query';

const strapi = useStrapiUtils();

export const useGetTaskMembers = (taskId: Ref<number | undefined>, enabled?: Ref<boolean>) =>
  useQuery({
    queryKey: ['task-members', taskId],
    queryFn: async () => {
      const res = await strapi.find<LearningPlanGroupSimple>(`learnin-plan-groups`, {
        filters: {
          task_members: {
            task: {
              id: taskId.value,
            },
          },
        },
        populate: {
          group_members: true,
        },
      });
      return res.data[0].group_members || [];
    },
    enabled,
    initialData: [],
  });
export type Member = LearningPlanMemberSimple & { responsable: boolean };
export const useGetProjectMembers = (projectId: Ref<number | undefined>, enabled?: Ref<boolean>) =>
  useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const res = await strapi.find<Member>('learning-plan-members', {
        filters: {
          learningplan: projectId.value,
        },
        populate: {
          user: {
            populate: {
              avatar: true,
            },
          },
        },
      });
      return res.data.map((item) => ({ ...item, responsible: false }));
    },
    enabled,
    initialData: [],
  });
