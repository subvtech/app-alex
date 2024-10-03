import { useMutation, useQuery } from '@tanstack/vue-query';

const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
export const useGetLearningGroup = (taskId: Ref<number | undefined>, enabled?: Ref<boolean>) =>
  useQuery({
    queryKey: ['learning-group', taskId],
    queryFn: async () => {
      const res = await strapiUtils.find<LearningPlanGroupSimple>(`learnin-plan-groups`, {
        filters: {
          task_members: {
            task: {
              id: taskId.value,
            },
          },
        },
        populate: ['group_members.student_member.user.avatar', 'task_members'],
      });
      return res.data[0];
    },
    enabled,
  });
export type Member = LearningPlanMemberSimple;
export type MemberItem = { id: number; raw: Member; role: string };
export const useGetProjectMembers = (projectId: Ref<number | undefined>, enabled?: Ref<boolean>) =>
  useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      const res = await strapiUtils.find<Member>('learning-plan-members', {
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
      return res.data.map((item) => ({ id: item.id, raw: item, role: 'standard' })) as MemberItem[];
    },
    enabled,
    initialData: [] as MemberItem[],
  });

type RemoveMemberPayload = { id: number };
export const useRemoveMember = () =>
  useMutation({
    mutationFn({ id }: RemoveMemberPayload) {
      return strapi.delete('learning-plan-group-members', id);
    },
  });
type UpdateMemberPayload = { id: number; role: string };
export const useUpdateMember = () =>
  useMutation({
    mutationFn({ id, role }: UpdateMemberPayload) {
      return strapi.update('learning-plan-group-members', id, { role });
    },
  });
