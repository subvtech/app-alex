import { useMutation, useQuery } from '@tanstack/vue-query';
import { queryClient } from '~/plugins/query';
export interface ProjectData {
  project: LearningPlanSimple;
  facilitator?: LearningPlanMemberSimple;
}

const queryConfig = (userID: number) => ({
  filters: {
    members: {
      $and: [{ user: { id: { $eq: userID } } }, { status: { $eq: 'joined' } }],
    },
    $or: [
      {
        members: {
          user: { id: { $eq: userID } },
          role: { $ne: 'student' },
        },
      },
      {
        hidden: { $eq: false },
      },
    ],
    archived_at: { $notNull: false },
    type: {
      $in: ['project', 'course_project'],
    },
  },
  populate: {
    cover_image: true,
    tags: true,
    learning_structures: {
      populate: ['trails'],
    },
    members: {
      populate: ['user.institutions', 'user.avatar'],
      filters: {
        role: { $eq: 'facilitator' },
      },
    },
  },
  sort: 'id:desc',
});
const getProjectsFn = (userID: number) => {
  const { find } = useStrapiUtils();
  return find<LearningPlanSimple>('learningplans', queryConfig(userID));
};
export const getFacilitator = (members: LearningPlanMemberSimple[]) => {
  return members.find((m) => m.role === MemberRoles.FACILITATOR);
};
// Querys
export const useGetMyProjects = (userId?: number) =>
  useQuery({
    queryKey: ['my-projects'],
    queryFn: async () => {
      if (!userId) {
        return { meta: {}, data: [] };
      }
      const projects = await getProjectsFn(userId);
      const mappedProjects: ProjectData[] = projects.data.map((project) => ({
        project,
        facilitator: getFacilitator(project.members),
      }));
      return { meta: {}, data: mappedProjects };
    },
    initialData: {
      meta: {},
      data: [],
    },
  });

// Mutations
export const useUpdateVisibility = () => {
  return useMutation({
    mutationFn: async (variables: {
      value: boolean;
      learninplanId: number;
    }) => {
      const { update } = useStrapi();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await update('learningPlans', variables.learninplanId, {
        hidden: variables.value,
      });
    },
    onMutate: ({ value, learninplanId }) => {
      queryClient.setQueryData(
        ['my-projects'],
        (projectValue: { meta: Object; data: ProjectData[] }) => {
          const updatedData = updateProjectVisibility(
            projectValue.data,
            learninplanId,
            value,
          );
          return { ...projectValue, data: updatedData };
        },
      );
    },
    onError: (_, { value, learninplanId }) => {
      const { setMessage } = useMessageStore();
      queryClient.setQueryData(
        ['my-projects'],
        (projectValue: { meta: Object; data: ProjectData[] }) => {
          const updatedData = updateProjectVisibility(
            projectValue.data,
            learninplanId,
            !value,
          );
          return { ...projectValue, data: updatedData };
        },
      );
      setMessage('Erro ao atualizar a visibilidade do projeto', 'error', true);
    },
  });
};
const updateProjectVisibility = (
  data: ProjectData[],
  learninplanId: number,
  value: boolean,
) => {
  return data.map((item) => {
    if (item.project.id === learninplanId) {
      return {
        ...item,
        project: { ...item.project, hidden: value },
      };
    }
    return item;
  });
};
