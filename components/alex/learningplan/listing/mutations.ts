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

const queryConfig = (userID: number, type: LearningPlanType, page: number) => ({
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
      ...(type !== 'course' ? { $in: ['project', 'course_project'] } : { $in: ['course'] }),
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
  pagination: {
    page,
    pageSize: 25,
  },
});
const getLearningPlanFn = async (type: LearningPlanType, userID: number) => {
  const { find } = useStrapiUtils();

  let page = 1;
  let pageCount = 1;
  const data: LearningPlanSimple[] = [];

  do {
    const response = await find<LearningPlanSimple>('learningplans', queryConfig(userID, type, page));

    data.push(...response.data);

    pageCount = response.meta.pagination.pageCount;
    page++;
  } while (page <= pageCount);

  return {
    data,
    meta: {
      pagination: {
        page: 1,
        pageSize: data.length,
        pageCount: 1,
        total: data.length,
      },
    },
  };
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
    queryKey: [`my-${type}s`, userId],
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
