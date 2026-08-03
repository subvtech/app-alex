import type { RubricEditContent, RubricPayload } from '@/utils/rubric';
import { rubricPayloadToEditContent, tiptapToPlainText } from '@/utils/rubric';

export interface GenerateRubricFromTaskParams {
  title: string;
  description?: unknown;
  learningGoals?: string[];
  criteriaCount?: number;
  extraInstructions?: string;
}

export const useRubricGeneration = () => {
  const isGenerating = ref(false);
  const { setMessage } = useMessageStore();
  const { t } = useI18n();

  const generateFromTask = async (params: GenerateRubricFromTaskParams): Promise<RubricEditContent | null> => {
    const title = params.title?.trim();

    if (!title) {
      setMessage(t('pages.evaluations.rubrics.ai.missingTask'), 'warning', true);
      return null;
    }

    isGenerating.value = true;

    try {
      const payload = await $fetch<RubricPayload>('/api/rubrics/generate', {
        method: 'POST',
        body: {
          taskTitle: title,
          taskDescription: tiptapToPlainText(params.description),
          learningGoals: params.learningGoals ?? [],
          criteriaCount: params.criteriaCount,
          extraInstructions: params.extraInstructions,
        },
      });

      if (!payload?.data?.length) {
        setMessage(t('pages.evaluations.rubrics.ai.empty'), 'error', true);
        return null;
      }

      setMessage(t('pages.evaluations.rubrics.ai.success'), 'success', true);

      return rubricPayloadToEditContent(payload, title);
    } catch (error: any) {
      console.error('[useRubricGeneration]', error);

      const reason = error?.data?.message ?? error?.message;

      setMessage(reason || t('pages.evaluations.rubrics.ai.fail'), 'error', true);

      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  return { isGenerating, generateFromTask };
};
