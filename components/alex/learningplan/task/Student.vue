<template>
  <div>
    <alex-learningplan-task-kanban
      ref="kanban"
      v-model="tasks.data"
      type="student"
      :columns="[
        {
          title: $t('components.learningPlan.drawer.task.status.toDo'),
          color: 'gray',
          group: 'to_do',
          accept: ['in_progress'],
        },
        {
          title: $t('components.learningPlan.drawer.task.status.inProgress'),
          color: 'blue',
          group: 'in_progress',
          accept: ['to_do'],
        },
        {
          title: $t('components.learningPlan.drawer.task.status.underReview'),
          color: 'orange',
          group: 'in_review',
          accept: ['in_progress', 'to_do'],
          disable: true,
        },
        {
          title: $t('components.learningPlan.drawer.task.status.done'),
          color: 'green',
          group: 'done',
          disable: true,
        },
      ]"
      @card-insert="
        (newIndex, value, newStatus) =>
          handleUpdateStatus(newIndex, value, newStatus)
      "
      @card-click="openDrawer"
    />

    <alex-learningplan-task-drawer-details
      v-if="selectedTask?.task"
      v-model="detailsDrawer"
      :task-id="selectedTask.task.id"
      :tags="selectedTask.task.tags"
      :title="selectedTask.task.title"
      :status="selectedTask.status"
      :type="selectedTask.task.type"
      :start-date="selectedTask.task.start_at || undefined"
      :final-date="selectedTask.task?.finish_at || undefined"
      :description="selectedTask.task.description || undefined"
      :restrictions="selectedTask.task?.allowed_editor_plugins || ''"
      :task-member-id="selectedTask.id"
      :submission="{
        constraints:
          selectedTask.task?.allowed_editor_plugins?.split(',') || [],
        description: selectedTask.task?.submission_description,
      }"
      @update-status="
        (newIndex, value, newStatus) =>
          handleUpdateStatus(newIndex, value, newStatus, true)
      "
    />
  </div>
</template>

<script setup lang="ts">
import { TaskStudent, InsertCardProps } from './kanban/index.vue';

interface StudentProps {
  studentId: number;
  learningplanId: number;
}

type Emits = {};
defineEmits<Emits>();
const props = defineProps<StudentProps>();
const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const selectedTask = ref<TaskStudent | undefined>(undefined);
const detailsDrawer = ref<boolean>(false);
const kanban = ref<{
  canDrag: boolean;
  setCanDrag: (value: boolean) => void;
  handleInsertCard: (data: InsertCardProps) => void;
} | null>(null);
const { t } = useI18n();

const getStudentTasks = (learningplanId: number, memberId: number) =>
  strapiUtils.find<TaskMember>('task-members', {
    populate: {
      task: {
        populate: ['tags'],
      },
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
  'task-members-student',
  () => getStudentTasks(props.learningplanId, props.studentId),
  {
    default: () => ({ meta: 0, data: [] as TaskStudent[] }),
    transform: ({ data, meta }) => {
      const dataValue = data.map((task) => ({
        id: task.id,
        status: task.status,
        date: new Date(task.finished_at?.replaceAll('-', '/')),
        title: task.task?.title,
        user: {
          name:
            task?.task_member_students[0]?.student_member?.user.fullname || '',
          avatar:
            task?.task_member_students[0]?.student_member?.user.avatar?.url ||
            undefined,
        },
        group: task.task?.type === 'group',
        studentClass:
          task?.task_member_students[0]?.student_member?.learning_class?.name ||
          '',
        task: task.task,
      })) as TaskStudent[];
      return {
        meta,
        data: dataValue,
      };
    },
  },
);
const handleUpdateStatus = async (
  newIndex: number,
  item: TaskStudent,
  newStatus: string,
  emitEvt: boolean = false,
) => {
  if (!kanban.value) {
    return;
  }

  if (emitEvt) {
    kanban.value.handleInsertCard({ newIndex, value: item, group: newStatus });
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

const openDrawer = (_index: number, card: TaskStudent) => {
  selectedTask.value = card;
  detailsDrawer.value = true;
};
</script>

<style scoped></style>
