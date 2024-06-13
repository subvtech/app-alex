import { defineStore } from 'pinia';
import { Task } from '@/models/simple/taskSimple.model';
export const useTaskStore = defineStore('task', () => {
  const { find } = useStrapiUtils();
  const task = ref<Task>();
  const loading = ref(false);
  const { setMessage } = useMessageStore();
  const i18n = useI18n();

  const populate = {
    task_members: {
      populate: [
        'task_submission',
        'task_member_students.student_member.user.avatar',
      ],
    },
    tags: true,
    learning_goals: {
      populate: ['verb'],
    },
    task_events: {
      populate: ['task_member.task_member_students.student_member.user.avatar'],
    },
  };

  async function loadTaskData(
    id: number,
    learningplanID: number,
    showMessageIfNotFound = true,
  ) {
    try {
      loading.value = true;
      const response = await find<Task>('tasks', {
        populate,
        filters: {
          id,
          learningplan: learningplanID,
        },
      });
      if (!response.data.length) {
        throw new Error('NotFoundError');
      }
      task.value = response.data[0];
      return response;
    } catch (e: any) {
      if (
        (e?.error?.name === 'NotFoundError' ||
          e?.message === 'NotFoundError') &&
        showMessageIfNotFound
      ) {
        setMessage(i18n.t('pages.tasks.notFound'), 'red', true);
      }
    } finally {
      loading.value = false;
    }
  }

  return { loadTaskData, task, loading };
});
