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
          accept: selectedTask?.task?.submission_required
            ? ['in_progress', 'in_review']
            : true,
        },
        {
          title: $t('components.learningPlan.drawer.task.status.inProgress'),
          color: 'blue',
          group: 'in_progress',
          accept: selectedTask?.task?.submission_required
            ? ['to_do', 'in_review']
            : true,
        },
        {
          title: $t('components.learningPlan.drawer.task.status.underReview'),
          color: 'orange',
          group: 'in_review',
          accept: selectedTask?.task?.submission_required
            ? ['to_do', 'in_progress']
            : true,
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
      :learningplan-id="learningplanId"
      :doc_name="selectedTask.task.doc_name"
      :tags="selectedTask.task.tags"
      :title="selectedTask.task.title"
      :trail="selectedTask.task.trail"
      :group="selectedTask.group"
      :status="selectedTask.status"
      :blocks="selectedTask.task.blocks"
      :type="selectedTask.task.type || undefined"
      :start-date="selectedTask.task.start_at || undefined"
      :final-date="selectedTask.task?.finish_at || undefined"
      :description="selectedTask.task.description || undefined"
      :restrictions="selectedTask.task?.allowed_editor_plugins || ''"
      :task-member-id="selectedTask.id"
      :submission="
        selectedTask.task?.submission_required
          ? {
              constraints:
                selectedTask.task?.allowed_editor_plugins?.split(',') || [],
              description: selectedTask.task?.submission_description || '',
            }
          : undefined
      "
      @update-status="
        (newIndex, value, newStatus) =>
          handleUpdateStatus(newIndex, value, newStatus, true)
      "
      @update-submission="execute()"
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
        populate: ['tags', 'blocks', 'trail'],
      },
      task_events: {
        populate: {
          learning_plan_member: {
            populate: ['user.avatar'],
          },
        },
      },
      task_submissions: {
        sort: 'updatedAt:desc',
      },
      learning_plan_member: {
        populate: ['user.avatar', 'learning_class'],
      },
      learning_plan_group: {
        populate: {
          group_members: {
            populate: [
              'student_member.user.avatar',
              'student_member.learning_class',
            ],
          },
          learning_class: true,
        },
      },
    },
    filters: {
      $and: [
        {
          $or: [
            { learning_plan_member: { id: memberId } },
            {
              learning_plan_group: {
                group_members: {
                  student_member: {
                    id: {
                      $in: [memberId],
                    },
                  },
                },
              },
            },
          ],
        },
        {
          task: {
            learningplan: learningplanId,
          },
        },
      ],
    },
  });
const { data: tasks, execute } = await useAsyncData(
  'task-members',
  () => getStudentTasks(props.learningplanId, props.studentId),
  {
    default: () => ({ meta: 0, data: [] as TaskStudent[] }),
    transform: ({ data, meta }) => {
      const filteredData = data.filter((task) => task.task?.status !== 'draft');
      const dataValue = filteredData.map((task) => ({
        id: task.id,
        status: task.status,
        doc_name: task.doc_name,
        date: new Date(task.finished_at?.replaceAll('-', '/')),
        title: task.task?.title,
        user: {
          name: task?.learning_plan_member?.user.fullname || '',
          avatar: task?.learning_plan_member?.user.avatar?.url || undefined,
        },
        ...(task.learning_plan_group?.learning_class?.name && {
          group: {
            name: task.learning_plan_group?.learning_class?.name || '',
            participants: task.learning_plan_group?.group_members.map(
              (member) => ({
                name: member.student_member.user.fullname,
                ...(member.student_member.user.avatar?.url && {
                  image: {
                    url: member.student_member.user.avatar?.url,
                  },
                  learning_class: member.student_member.learning_class?.name,
                  role: member.role,
                }),
              }),
            ),
          },
        }),
        studentClass:
          task?.learning_plan_member?.learning_class?.name ||
          task.learning_plan_group?.learning_class?.name ||
          '',
        task: task.task,
        submissions: task.task_submissions,
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
  const taskMember = tasks.value.data.find((task) => item.id === task.id);
  if (!taskMember) {
    return;
  }
  if (emitEvt) {
    kanban.value.handleInsertCard({ newIndex, value: item, group: newStatus });
  }

  try {
    kanban.value.setCanDrag(false);
    const submissionValidationStatus = ['in_review', 'in_progress'];
    const time = new Date();
    const lastSubmission = taskMember.submissions?.length
      ? taskMember?.submissions[0]
      : undefined;
    if (taskMember?.task?.submission_required) {
      if (newStatus === 'in_review' && !lastSubmission) {
        throw new Error('missingSubmission');
      }
      if (newStatus === 'in_review' && lastSubmission) {
        await strapi.update('task-submissions', lastSubmission.id, {
          submitted_at: time.toISOString(),
        });
      }
      if (newStatus === 'in_progress' && item.status !== 'to_do') {
        await strapi.create('task-submissions', {
          task_member: taskMember.id,
          submission: lastSubmission?.submission,
        });
      }
    }
    await strapi.update<TaskMember>('task-members', taskMember.id, {
      status: newStatus as TaskMemberStatus,
      ...(submissionValidationStatus.includes(newStatus) && {
        last_submission_at:
          newStatus === 'in_progress' && taskMember.submissions
            ? null
            : time.toISOString(),
      }),
    });
  } catch (error) {
    tasks.value.data = tasks.value.data.map((task) => {
      if (task.id === item.id) {
        return { ...task, status: item.status };
      }
      return task;
    });
    if ((error as any)?.message === 'missingSubmission') {
      setMessage(
        t('components.learningPlan.drawer.task.errors.missingSubmission'),
        'error',
        true,
      );
      return;
    }
    setMessage(t('pages.tasks.errors.updateStatusTask'), 'error', true);
  } finally {
    await execute();
    kanban.value.setCanDrag(true);
  }
};
const openDrawer = (_index: number, card: TaskStudent) => {
  selectedTask.value = card;
  detailsDrawer.value = true;
};
</script>

<style scoped></style>
