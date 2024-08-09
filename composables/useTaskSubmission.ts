// eslint-disable-next-line import/named
import { AsyncDataOptions } from 'nuxt/dist/app/composables';
type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;
export function useTaskSubmission(
  taskMemberId: Ref<number>,
  options?: AsyncDataOptions<
    { meta: any; data: TaskSubmissionSimple[] },
    { meta: any; data: TaskSubmissionSimple[] },
    KeysOf<{ meta: any; data: TaskSubmissionSimple[] }>,
    { meta: any; data: TaskSubmissionSimple[] }
  >,
) {
  const strapiUtils = useStrapiUtils();
  const getSubmissions = (memberID: number) =>
    strapiUtils.find<TaskSubmissionSimple>('task-submissions', {
      filters: {
        task_member: memberID,
      },
      sort: 'createdAt:desc',
    });
  return useAsyncData(
    `task-submissions-${taskMemberId}`,
    () => getSubmissions(taskMemberId.value),
    {
      default: () => ({
        meta: { total: 0 },
        data: [] as TaskSubmissionSimple[],
      }),
      lazy: true,
      ...options,
    },
  );
}
