export type SubmissionItemType = 'text' | 'image' | 'video' | 'file' | 'url' | 'quiz';
export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'open';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  statement: string;
  options: string[];
  correctOption: number | null;
  correctBoolean: boolean | null;
}

export interface SubmissionItem {
  id: string;
  type: SubmissionItemType;
  title: string;
  questions: QuizQuestion[];
}

export interface SubmissionUploadedFile {
  id: number;
  name: string;
  ext: string;
  size: number;
  url: string;
}

export interface SubmissionItemAnswer {
  text?: string;
  url?: string;
  files?: SubmissionUploadedFile[];
  quiz?: Record<string, number | boolean | string | null>;
}

export type SubmissionAnswers = Record<string, SubmissionItemAnswer>;

export interface SubmissionItemsContent {
  type: 'submission_items';
  content: [];
  answers: SubmissionAnswers;
}

export const createSubmissionItemId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createQuizQuestion = (type: QuizQuestionType): QuizQuestion => ({
  id: createSubmissionItemId(),
  type,
  statement: '',
  options: type === 'multiple_choice' ? ['', ''] : [],
  correctOption: null,
  correctBoolean: null,
});

const SAVE_DELAY = 800;
const pendingSaves = new Map<number, ReturnType<typeof setTimeout>>();

export function useSubmissionItems(taskId: MaybeRefOrGetter<number | undefined>) {
  const { findOne, update } = useStrapi();
  const { setMessage } = useMessageStore();
  const { t } = useI18n();
  const all = useState<Record<number, SubmissionItem[]>>('task-submission-items', () => ({}));
  const loading = useState<Record<number, boolean>>('task-submission-items-loading', () => ({}));

  const load = async (id: number | undefined) => {
    if (!id || id < 0 || all.value[id] || loading.value[id]) return;
    loading.value = { ...loading.value, [id]: true };
    try {
      const response = await findOne<{ submission_items?: SubmissionItem[] | null }>('tasks', id, {
        fields: ['submission_items'],
      });
      const attributes = (response.data as any)?.attributes ?? response.data;
      all.value = {
        ...all.value,
        [id]: Array.isArray(attributes?.submission_items) ? attributes.submission_items : [],
      };
    } catch {
      all.value = { ...all.value, [id]: [] };
    } finally {
      loading.value = { ...loading.value, [id]: false };
    }
  };

  const save = (id: number, value: SubmissionItem[]) => {
    clearTimeout(pendingSaves.get(id));
    pendingSaves.set(
      id,
      setTimeout(async () => {
        pendingSaves.delete(id);
        try {
          await update('tasks', id, { submission_items: value });
        } catch {
          setMessage(t('components.courses.tasks.submission_items.saveError'), 'error', true);
        }
      }, SAVE_DELAY),
    );
  };

  watch(() => toValue(taskId), load, { immediate: true });

  const items = computed<SubmissionItem[]>({
    get: () => {
      const id = toValue(taskId);
      return (id && all.value[id]) || [];
    },
    set: (value) => {
      const id = toValue(taskId);
      if (!id || id < 0) return;
      all.value = { ...all.value, [id]: value };
      save(id, value);
    },
  });

  return { items };
}
