<template>
  <div v-if="taskStore.loading">
    <alex-learningplan-task-header-loader />
    <alex-learningplan-task-kanban-loader />
  </div>
  <section
    v-else-if="
      !taskStore.loading && taskStore.task && learningPlanStore.learningPlan?.id
    "
  >
    <!-- Testando
    <alex-custom-button @click="detailsDrawer = true"
      >Testar drawer novo</alex-custom-button
    >
    <alex-learningplan-task-drawer-details
      v-model="detailsDrawer"
      :task-id="taskId"
      :tags="taskStore.task.tags"
      :title="taskStore.task.title"
      :status="taskStore.task.status"
      :type="taskStore.task?.type || undefined"
      :start-date="taskStore.task?.start_at || undefined"
      :final-date="taskStore.task?.finish_at || undefined"
      :description="taskStore.task?.description || undefined"
      :restrictions="taskStore.task.allowed_editor_plugins || ''"
      :task-member-id="studentDetailsId || -1"
      :submission="{
        constraints: taskStore.task.allowed_editor_plugins?.split(',') || [],
        description: taskStore.task.submission_description,
      }"
    /> -->
    <!-- Testando -->
    <alex-learningplan-task-header
      :title="taskStore.task.title"
      :tags="headerTags"
      :type="taskStore.task.type"
      :description="taskStore.task.description || ''"
      :deadline-at="taskStore.task.finish_at"
      :start-at="taskStore.task.start_at"
      :status="taskStore.task.status"
      :send-submission="taskStore.task.submission_required"
      :send-submission-after-deadline="taskStore.task.can_submit_after_deadline"
      @edit-click="teacherDrawer = true"
    />
    <alex-learningplan-task-kanban
      ref="kanban"
      v-model="tasks"
      type="professor"
      :classes="['turma A']"
      :columns="[
        {
          title: 'A fazer',
          color: 'gray',
          group: 'to_do',
          accept: true,
        },
        {
          title: 'Em progresso',
          color: 'blue',
          group: 'in_progress',
          accept: true,
        },
        {
          title: 'Em avaliação',
          color: 'orange',
          group: 'in_review',
          accept: true,
        },
        {
          title: 'Concluído',
          color: 'green',
          group: 'done',
          accept: true,
        },
      ]"
      @card-click="
        (_index, item) => {
          studentDrawer = true;
          studentDetailsId = item.id;
        }
      "
      @card-insert="
        (newIndex, value, newStatus) =>
          handleUpdateStatus(newIndex, value, newStatus)
      "
    />
    <alex-learningplan-task-drawer-student
      v-if="studentDetails"
      v-model="studentDrawer"
      :submission="{
        constraints: taskStore.task.allowed_editor_plugins?.split(',') || [],
        description: taskStore.task.submission_description,
      }"
      :can-submit-after-deadline-task="taskStore.task.can_submit_after_deadline"
      :can-submit-after-deadline="studentDetails.can_submit_after_deadline"
      :task-member-id="studentDetails.id"
      :finish-at="studentDetails.finished_at"
      :status="studentDetails.status"
      :student="{
        name: studentDetails.task_member_students[0].student_member.user
          .fullname,
        studentClass:
          studentDetails.task_member_students[0].student_member?.learning_class
            ?.name || '',
        avatar:
          studentDetails.task_member_students[0].student_member.user?.avatar
            ?.url,
      }"
      @change-finish-at="handleChangeFinishAt"
      @change-submit-after-deadline="handleChangeSendAfterDeadline"
    />
    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      :learningplan-id="learningPlanId"
      :task-id="taskId"
      :tags="taskStore.task.tags"
      :title="taskStore.task.title"
      :type="taskStore.task.type"
      :trail="taskStore.task.trail"
      :blocks="taskStore.task.blocks"
      :status="taskStore.task.status"
      :events="taskStore.task.task_events"
      :goals="taskStore.task.learning_goals"
      :description="taskStore.task.description || ''"
      :submission-description="taskStore.task.submission_description"
      :has-submission="taskStore.task.submission_required"
      :send-after-deadline="taskStore.task.can_submit_after_deadline"
      :start-date="taskStore.task.start_at"
      :end-date="taskStore.task.finish_at"
      :restrictions="taskStore.task.allowed_editor_plugins || ''"
      :editable="true"
      :members-length="taskStore.task.task_members?.length"
      @change-values="handleChangeValues"
      @change-description="handleChangeDescription"
      @change-submission-description="handleChangeSubmissionDescription"
      @change-tags="handleChangeTags"
      @change-members="taskStore.updateTaskMembers(taskId)"
    />
  </section>
</template>

<script setup lang="ts">
import { Task } from '@/components/alex/learningplan/task/kanban/index.vue';
definePageMeta({
  hideLearningPlanBanner: true,
});

const teacherDrawer = ref(false);
const studentDrawer = ref(false);
// const detailsDrawer = ref<boolean>(false);
const learningPlanStore = useLearningPlanStore();
const headerStore = usePageHeaderStore();
const route = useRoute();
const { t } = useI18n();
const { id, taskId: taskIdValue } = route.params;
const { setMessage } = useMessageStore();
const strapi = useStrapi();
const taskId = computed(() => parseInt(taskIdValue.toString()));
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const taskStore = useTaskStore();
const tasks = ref<any[]>([]);
const studentDetailsId = ref<number>(-1);

const studentDetails = computed(() => {
  if (!taskStore.task?.task_members) {
    return null;
  }
  const member = taskStore.task?.task_members.find(
    (member) => member.id === studentDetailsId.value,
  );
  return member || null;
});

const kanban = ref<{
  canDrag: boolean;
  setCanDrag: (value: boolean) => void;
} | null>(null);
const headerTags = computed(() => {
  if (!(taskStore && taskStore.task) || !taskStore) return [];
  return taskStore.task.tags.map((tag) => tag.text);
});
const handleChangeTags = (tags: TagSimple[]) => {
  if (!taskStore.task) return;
  taskStore.task.tags = tags;
};
const handleChangeDescription = (description: string) => {
  if (!taskStore.task) return;
  taskStore.task.description = description;
};
const handleChangeSubmissionDescription = (description: string) => {
  if (!taskStore.task) return;
  taskStore.task.submission_description = description;
};
const handleChangeValues = (values: Partial<TaskSimple>) => {
  if (!taskStore.task) return;
  taskStore.task = {
    ...(taskStore.task as TaskSimple),
    status: values.status!,
    type: values.type,
    start_at: values.start_at,
    finish_at: values.finish_at,
    submission_required: values.submission_required!,
    can_submit_after_deadline: values.can_submit_after_deadline!,
    allowed_editor_plugins: values.allowed_editor_plugins!,
  };
};
const handleUpdateStatus = async (
  _newIndex: number,
  item: Task,
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
    tasks.value = tasks.value.map((task) => {
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
const handleChangeFinishAt = (memberID: number, value: string) => {
  if (taskStore.task?.task_members) {
    taskStore.task.task_members = taskStore.task?.task_members.map((member) => {
      if (member.id === memberID) {
        return { ...member, finished_at: value };
      }
      return member;
    });
  }
};
const handleChangeSendAfterDeadline = (memberID: number, value: boolean) => {
  if (taskStore.task?.task_members) {
    taskStore.task.task_members = taskStore.task?.task_members.map((member) => {
      if (member.id === memberID) {
        return { ...member, can_submit_after_deadline: value };
      }
      return member;
    });
  }
};
onBeforeMount(() => {
  if (!id || !taskId.value) {
    return navigateTo(`/courses`);
  }
  headerStore.showHeader = true;
  learningPlanStore.loadLearningPlan(Number(id));
  taskStore.loadTaskData(taskId.value, Number(id));
});

watch(
  () => [learningPlanStore.loading, taskStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = t('pages.classes.breadcrumbs.myCourses');
      headerStore.items = [
        {
          title: t('pages.classes.breadcrumbs.home'),
          to: '/',
          disabled: true,
        },
        {
          title: t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
          disabled: false,
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          to: `/courses/${id}`,
          disabled: false,
        },
        {
          title: t('components.courses.tasks.title'),
          disabled: false,
          to: `/courses/${id}/tasks`,
        },
        {
          title: `${taskStore.task?.title || ''}`,
          to: `/courses/${id}/tasks/${taskStore.task?.id}`,
          disabled: true,
        },
      ];
      if (!taskStore.task && !taskStore.loading) {
        navigateTo(`/courses/${route.params.id}/tasks`);
      }
      if (!learningPlanStore.userIsFacilitator) {
        navigateTo(`/courses/${route.params.id}/tasks`);
      }
    }
  },
);
watch(
  () => taskStore.task?.task_members,
  () => {
    if (taskStore.task?.task_members) {
      tasks.value = taskStore.task.task_members.map((task) => ({
        id: task.id,
        status: task.status,
        date: new Date(task.finished_at?.replaceAll('-', '/')),
        user: {
          name:
            task?.task_member_students[0]?.student_member?.user.fullname || '',
          avatar:
            task?.task_member_students[0]?.student_member?.user.avatar?.url ||
            undefined,
        },
        studentClass:
          task?.task_member_students[0]?.student_member?.learning_class?.name ||
          '',
      }));
    }
  },
);
</script>

<style scoped></style>
