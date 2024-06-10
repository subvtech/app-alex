import { defineStore } from 'pinia';
import { Task } from '@/models/simple/taskSimple.model';
export const useTaskStore = defineStore('task', () => {
  const { findOne } = useStrapiUtils();
  const task = ref<Task>();
  const loading = ref(false);
  const { setMessage } = useMessageStore();

  const populate = {
    task_members: {
      populate: [
        'task_submission',
        'task_events',
        'task_member_students.student_member.user.avatar',
      ],
    },
    tags: true,
    learning_goals: {
      populate: ['verb'],
    },
    task_events: true,
  };

  async function loadTaskData(id: number, showMessageIfNotFound = true) {
    try {
      loading.value = true;
      const response = await findOne<Task>('tasks', id, { populate });
      task.value = response.data;
      return response;
    } catch (e: any) {
      const i18n = useI18n();
      if (e?.error.name === 'NotFoundError' && showMessageIfNotFound) {
        setMessage(i18n.t('pages.tasks.notFound'), 'red', true);
      }
    } finally {
      loading.value = false;
    }
  }

  return { loadTaskData, task, loading };
});
