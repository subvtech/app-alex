<template>
  <div>
    <alex-learningplan-task-kanban
      ref="kanban"
      v-model="tasks.data"
      type="student"
      :columns="[
        {
          title: 'A fazer',
          color: 'gray',
          group: 'to_do',
          accept: ['in_progress'],
        },
        {
          title: 'Em progresso',
          color: 'blue',
          group: 'in_progress',
          accept: ['to_do'],
        },
        {
          title: 'Em avaliação',
          color: 'orange',
          group: 'in_review',
          accept: ['in_progress', 'to_do'],
          disable: true,
        },
        {
          title: 'Concluído',
          color: 'green',
          group: 'done',
          disable: true,
        },
      ]"
      @card-insert="
        (newIndex, value, newStatus) =>
          handleUpdateStatus(newIndex, value, newStatus)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { TaskStudent } from './kanban/index.vue';

interface StudentProps {
  studentId: number;
  learningplanId: number;
}
const props = defineProps<StudentProps>();
const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const kanban = ref<{
  canDrag: boolean;
  setCanDrag: (value: boolean) => void;
} | null>(null);
const { t } = useI18n();
const getStudentTasks = (learningplanId: number, memberId: number) =>
  strapiUtils.find<TaskMember>('task-members', {
    populate: {
      task: true,
      task_events: {
        populate: {
          learning_plan_member: {
            populate: ['user.avatar'],
          },
        },
      },
      task_submissions: true,
      task_member_students: {
        populate: [
          'student_member.user.avatar',
          'student_member.learning_class',
        ],
      },
    },
    filters: {
      task_member_students: {
        student_member: { id: memberId },
      },
      task: {
        learningplan: learningplanId,
      },
    },
  });
const { data: tasks } = await useAsyncData(
  'classes-member-invite',
  () => getStudentTasks(props.learningplanId, props.studentId),
  {
    default: () => ({ meta: 0, data: [] as TaskStudent[] }),
    transform({ meta, data }) {
      return {
        meta,
        data: data.map((task) => ({
          id: task.id,
          status: task.status,
          date: new Date(task.finished_at?.replaceAll('-', '/')),
          title: task.task?.title,
          user: {
            name:
              task?.task_member_students[0]?.student_member?.user.fullname ||
              '',
            avatar:
              task?.task_member_students[0]?.student_member?.user.avatar?.url ||
              undefined,
          },
          studentClass:
            task?.task_member_students[0]?.student_member?.learning_class
              ?.name || '',
        })),
      };
    },
  },
);
const handleUpdateStatus = async (
  _newIndex: number,
  item: TaskStudent,
  newStatus: string,
) => {
  if (!kanban.value) {
    return;
  }
  try {
    kanban.value.setCanDrag(false);
    await strapi.update<TaskMember>('task-members', item.id, {
      status: newStatus as TaskMemberStatus,
    });
  } catch (error) {
    tasks.value.data = tasks.value.data.map((task) => {
      if (task.id === item.id) {
        return { ...task, status: item.status };
      }
      return task;
    });
    setMessage(t('pages.tasks.errors.updateStatusTask'), 'error', true);
  } finally {
    kanban.value.setCanDrag(true);
  }
};
</script>

<style scoped></style>
