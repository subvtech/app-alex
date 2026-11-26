import type { AsyncDataOptions } from '#app';
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

/**
 * Fetches the latest content for a submission by its validated ID and marks it as submitted.
 */
export async function submitTaskSubmission(lastSubmission: TaskSubmissionSimple, submittedAt: string): Promise<void> {
  const submissionId = parseValidStrapiId(lastSubmission?.id, 'submitTaskSubmission');
  if (submissionId === null) {
    if (
      import.meta.dev &&
      (lastSubmission?.id === undefined || lastSubmission?.id === null || lastSubmission?.id === 0)
    ) {
      console.warn('[submitTaskSubmission] Missing or invalid submission ID:', lastSubmission?.id);
    }
    throw new Error('missingSubmission');
  }

  const strapi = useStrapi();
  const { findOne } = useStrapiUtils();

  const lastSubRes = await findOne<TaskSubmissionSimple>('task-submissions', submissionId, {
    fields: ['submission'],
  });

  // Valor atualizado da ultima submissão, caso tenha sido alterado
  const lastSubVal = lastSubRes.data?.submission;
  const resolvedSubmission =
    (lastSubVal as { submission?: EditorSubmission } | undefined)?.submission ??
    lastSubVal ??
    lastSubmission.submission;

  await strapi.update('task-submissions', submissionId, {
    ...(resolvedSubmission != null && { submission: resolvedSubmission }),
    submitted_at: submittedAt,
  });
}
