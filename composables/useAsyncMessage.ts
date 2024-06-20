// eslint-disable-next-line import/named
import { AsyncDataOptions } from 'nuxt/dist/app/composables';
type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;
export const useAsyncMessage = (
  taskMemberId: number,
  options?: AsyncDataOptions<
    { meta: any; data: TaskMemberMessage[] },
    { meta: any; data: TaskMemberMessage[] },
    KeysOf<{ meta: any; data: TaskMemberMessage[] }>,
    { meta: any; data: TaskMemberMessage[] }
  >,
) => {
  const strapiUtils = useStrapiUtils();
  const getMessages = (memberID: number) =>
    strapiUtils.find<TaskMemberMessage>('task-member-messages', {
      filters: {
        task_member: memberID,
      },
      populate: {
        learning_plan_member: {
          populate: ['user.avatar'],
        },
        response_to_message: {
          populate: {
            learning_plan_member: {
              populate: ['user.avatar'],
            },
            audio: true,
          },
        },
        task_submission: true,
        audio: true,
      },
      pagination: {
        limit: 1000,
        start: 0,
      },
      sort: 'sent_at:asc',
    });
  return useAsyncData(
    'task-member-messages',
    () => getMessages(taskMemberId),
    options,
  );
};
