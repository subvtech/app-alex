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
    <alex-learningplan-task-header
      :title="taskStore.task.title"
      :tags="tags"
      :type="taskStore.task.type"
      :description="taskStore.task.description"
      :deadline-at="taskStore.task.finish_at"
      :start-at="taskStore.task.start_at"
      :status="taskStore.task.status"
      :send-submission="taskStore.task.submission_required"
      :send-submission-after-deadline="taskStore.task.can_submit_after_deadline"
      @edit-click="teacherDrawer = true"
    />
    <alex-learningplan-task-kanban
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
      @card-click="studentDrawer = true"
    />
    <alex-learningplan-task-drawer-student
      v-model="studentDrawer"
      :messages="[]"
      :submission="{
        constraints: [],
        description: 'Teste',
        status: 'not_started',
      }"
      :deadline="new Date()"
      send-submission
      :submissions="[]"
      :task="{ finalDate: new Date(), status: 'to_do' }"
      :student="{ name: 'Jorge santos lima', studentClass: 'Turma A' }"
    />
    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      :learningplan-id="learningPlanId"
      :task-id="taskId"
      :tags="taskStore.task.tags"
      :title="taskStore.task.title"
      :type="taskStore.task.type"
      :status="taskStore.task.status"
      :events="taskStore.task.task_events"
      :goals="taskStore.task.learning_goals"
      :description="taskStore.task.description"
      :submission-description="taskStore.task.submission_description"
      :has-submission="taskStore.task.submission_required"
      :send-after-deadline="taskStore.task.can_submit_after_deadline"
      :start-date="taskStore.task.start_at"
      :end-date="taskStore.task.finish_at"
      :messages="[]"
      :restrictions="taskStore.task.allowed_editor_plugins || ''"
      :editable="true"
      @change-values="handleChangeValues"
      @change-description="handleChangeDescription"
      @change-submission-description="handleChangeSubmissionDescription"
      @change-tags="handleChangeTags"
    />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  hideLearningPlanBanner: true,
});

const teacherDrawer = ref(false);
const studentDrawer = ref(false);
const learningPlanStore = useLearningPlanStore();
const { t } = useI18n();
const headerStore = usePageHeaderStore();
const route = useRoute();
const { id, taskId: taskIdValue } = route.params;
const taskId = computed(() => parseInt(taskIdValue.toString()));
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const taskStore = useTaskStore();
const tasks = ref<any[]>([]);
const tags = computed(() => {
  if (!(taskStore && taskStore.task) || !taskStore) return [];
  return taskStore.task.tags.map((tag) => tag.text);
});
const handleChangeTags = (tags: TagSimple[]) => {
  if (!taskStore.task) return;
  taskStore.task = {
    ...taskStore.task,
    tags,
  };
};
const handleChangeDescription = (description: string) => {
  if (!taskStore.task) return;
  taskStore.task = {
    ...taskStore.task,
    description,
  };
};
const handleChangeSubmissionDescription = (description: string) => {
  if (!taskStore.task) return;
  taskStore.task = {
    ...taskStore.task,
    submission_description: description,
  };
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
  };
};
onBeforeMount(() => {
  headerStore.showHeader = true;
  if (!id || !taskId.value) {
    return navigateTo(`/courses/`);
  }
  if (!Number.isInteger(Number(id))) {
    return navigateTo(`/courses/${id}`);
  }
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
    }
    if (!taskStore.task && !taskStore.loading) {
      navigateTo(`/courses/${route.params.id}/tasks`);
    }
    if (taskStore.task) {
      tasks.value = taskStore.task.task_members.map((task) => ({
        id: task.id,
        status: task.status,
        date: new Date(task.finished_at.replaceAll('-', '/')),
        user: {
          name:
            task.task_member_students[0]?.student_member.user.fullname || '',
        },
        studentClass:
          task.task_member_students[0]?.student_member.learning_class?.name ||
          '',
      }));
    }
  },
);
</script>

<style scoped></style>
