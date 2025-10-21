import { TaskSimple } from '@/models/simple/taskSimple.model';
import { defineStore } from 'pinia';
export const useTaskStore = defineStore('task', () => {
  const { find } = useStrapiUtils();
  const { update } = useStrapi();

  const task = ref<TaskSimple>();
  const loading = ref(false);
  const { setMessage } = useMessageStore();
  const i18n = useI18n();

  const populate = {
    task_members: {
      populate: {
        task_submissions: {
          sort: 'updatedAt:desc',
        },
        learning_plan_member: {
          populate: ['user.avatar', 'learning_class', 'user.user_wallet'],
        },
        learning_plan_group: {
          populate: [
            'group_members.student_member.user.avatar',
            'learning_class',
            'group_members.student_member.user.user_wallet',
          ],
        },
      },
    },
    tags: true,
    blocks: true,
    trail: true,
    learning_goals: {
      populate: ['verb'],
    },
    task_events: {
      populate: {
        task_member: {
          populate: ['learning_plan_member.user.avatar', 'learning_plan_member.user.user_wallet'],
        },
        learning_plan_member: {
          populate: ['user.avatar', 'user.user_wallet'],
        },
      },
    },
  };

  async function loadTaskData(id: number, learningplanID: number, showMessageIfNotFound = true) {
    try {
      loading.value = true;
      const response = await find<TaskSimple>('tasks', {
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
      if ((e?.error?.name === 'NotFoundError' || e?.message === 'NotFoundError') && showMessageIfNotFound) {
        setMessage(i18n.t('pages.tasks.notFound'), 'red', true);
      }
    } finally {
      loading.value = false;
    }
  }

  async function updateTaskMembers(taskId: number) {
    try {
      const response = await find<TaskMember>('task-members', {
        populate: [
          'task_submission',
          'learning_plan_member.user.avatar',
          'learning_plan_member.user.user_wallet',
          'learning_plan_member.learning_class',
          'learning_plan_group.group_members.student_member.user.avatar',
          'learning_plan_group.group_members.student_member.user.user_wallet',
          'learning_plan_group.learning_class',
        ],
        filters: {
          task: taskId,
        },
      });
      const { data } = response;
      if (task.value) {
        task.value.task_members = data;
      }
      return response;
    } catch (e: any) {
      setMessage(i18n.t('pages.tasks.cantUpdateMembers'), 'red', true);
    }
  }

  async function updateTaskContractAddress(taskId: number, contractAddress: string | null) {
    try {
      const response = await update(`tasks/${taskId}`, {
        contract_address: contractAddress,
      });
      console.log({ updateTaskContractAddress: contractAddress });
      console.log(response);
      const { data } = response;
      if (task.value) {
        task.value.contract_address = data.attributes.contract_address || null;
      }
      return response;
    } catch (e: any) {
      setMessage(i18n.t('pages.tasks.cantUpdateMembers'), 'red', true);
    }
  }

  return { loadTaskData, task, loading, updateTaskContractAddress, updateTaskMembers };
});
