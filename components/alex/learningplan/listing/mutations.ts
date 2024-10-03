import { useMutation, useQuery } from '@tanstack/vue-query';
export interface LearningPlanData {
  learningPlan: LearningPlanSimple;
  facilitator?: LearningPlanMemberSimple;
  leader?: LearningPlanMemberSimple;
  trails: {
    count: number;
  };
}
type LearningPlanType = LearningPlanSimple['type'];

const queryConfig = (userID: number, type: LearningPlanType) => ({
  filters: {
    members: {
      $and: [{ user: { id: { $eq: userID } } }, { status: { $eq: 'joined' } }],
    },
    $or: [
      {
        members: {
          user: { id: { $eq: userID } },
          role: { $eq: MemberRoles.FACILITATOR },
        },
      },
      {
        hidden: { $eq: false },
      },
    ],
    archived_at: { $notNull: false },
    type: {
      ...(type !== LearningPlanType.COURSE
        ? { $in: [LearningPlanType.PROJECT, LearningPlanType.COURSE_PROJECT] }
        : { $in: [LearningPlanType.COURSE] }),
    },
  },
  populate: {
    cover_image: true,
    tags: true,
    product: true,
    fields: true,
    learning_structures: {
      populate: ['trails'],
    },
    members: {
      populate: ['user.institutions', 'user.avatar'],
    },
    institutions: {
      populate: ['cover'],
    },
  },
  sort: 'id:desc',
});
const getLearningPlanFn = (type: LearningPlanType, userID: number) => {
  const { find } = useStrapiUtils();
  return find<LearningPlanSimple>('learningplans', queryConfig(userID, type));
};
export const getFacilitator = (members: LearningPlanMemberSimple[]) => {
  return members.find((m) => m.role === MemberRoles.FACILITATOR);
};
export const getLeader = (members: LearningPlanMemberSimple[]) => {
  return members.find((m) => m.role === MemberRoles.LEADER);
};
const countTrails = (learningPlan: LearningPlanSimple) =>
  learningPlan.learning_structures.flatMap((structure) => structure.trails).length;
// Querys
export const useGetMyLearningPlan = (type: LearningPlanType, userId: number) =>
  useQuery({
    queryKey: [`my-${type}s`],
    queryFn: async () => {
      if (!userId) {
        return { meta: {}, data: [] };
      }
      const learningPlans = await getLearningPlanFn(type, userId);
      const mappedLearningPlans: LearningPlanData[] = learningPlans.data.map((learningPlan) => ({
        learningPlan,
        facilitator: getFacilitator(learningPlan.members),
        leader: getLeader(learningPlan.members),
        trails: {
          count: countTrails(learningPlan),
        },
      }));
      return { meta: {}, data: mappedLearningPlans };
    },
    initialData: {
      meta: {},
      data: [],
    },
  });

// Mutations
export const useUpdateVisibility = () => {
  return useMutation({
    mutationFn: async (variables: { value: boolean; learninplanId: number; type: LearningPlanType }) => {
      const { update } = useStrapi();
      await update('learningPlans', variables.learninplanId, {
        hidden: variables.value,
      });
    },
    onMutate: ({ value, learninplanId, type }) => {
      const { $queryClient } = useNuxtApp();
      $queryClient.setQueryData([`my-${type}s`], (projectValue: { meta: Object; data: LearningPlanData[] }) => {
        const updatedData = updateProjectVisibility(projectValue.data, learninplanId, value);
        return { ...projectValue, data: updatedData };
      });
    },
    onError: (_, { value, learninplanId, type }) => {
      const { $queryClient } = useNuxtApp();
      const { setMessage } = useMessageStore();
      $queryClient.setQueryData([`my-${type}s`], (projectValue: { meta: Object; data: LearningPlanData[] }) => {
        const updatedData = updateProjectVisibility(projectValue.data, learninplanId, !value);
        return { ...projectValue, data: updatedData };
      });
      setMessage('Erro ao atualizar a visibilidade do projeto', 'error', true);
    },
  });
};
const updateProjectVisibility = (data: LearningPlanData[], learninplanId: number, value: boolean) => {
  return data.map((item) => {
    if (item.learningPlan.id === learninplanId) {
      return {
        ...item,
        learningPlan: { ...item.learningPlan, hidden: value },
      };
    }
    return item;
  });
};
