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
      @change-values="
        (values) => {
          taskStore.task = {
            ...(taskStore.task as Task),
            status: values.status,
            type: values.type,
            start_at: values.start_at,
            finish_at: values.finish_at,
            submission_required: values.submission_required,
            can_submit_after_deadline: values.can_submit_after_deadline,
          };
        }
      "
      @change-description="
        (value) =>
          (taskStore.task = {
            ...(taskStore.task as Task),
            description: value,
          })
      "
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
const i18n = useI18n();
const headerStore = usePageHeaderStore();
const route = useRoute();
const taskId = computed(() => parseInt(route.params?.taskId.toString()));
const learningPlanId = computed(() => parseInt(route.params?.id.toString()));
const taskStore = useTaskStore();
const tasks = ref([
  {
    id: 1,
    status: 'in_progress',
    date: new Date(),
    studentClass: 'Turma a',
    user: { name: 'test' },
  },
]);
const tags = computed(() => {
  if (!(taskStore && taskStore.task) || !taskStore) return [];
  return taskStore.task.tags.map((tag) => tag.text);
});
onBeforeMount(() => {
  headerStore.showHeader = true;
  if (!route.params.id || !taskId.value) {
    return navigateTo(`/courses/`);
  }
  if (!Number.isInteger(Number(route.params.id))) {
    return navigateTo(`/courses/${route.params.id}`);
  }
  taskStore.loadTaskData(taskId.value, Number(route.params.id));
});

watch(
  () => [learningPlanStore.loading, taskStore.loading],
  () => {
    if (!learningPlanStore.loading) {
      headerStore.title = i18n.t('pages.classes.breadcrumbs.myCourses');
      headerStore.items = [
        {
          title: i18n.t('pages.classes.breadcrumbs.home'),
          to: '/',
          disabled: true,
        },
        {
          title: i18n.t('pages.classes.breadcrumbs.myCourses'),
          to: '/courses/me',
          disabled: false,
        },
        {
          title: learningPlanStore.learningPlan?.title || '',
          to: `/courses/${learningPlanStore.learningPlan?.id}`,
          disabled: false,
        },
        {
          title: `${taskStore.task?.title || ''}`,
          to: `/courses/${learningPlanStore.learningPlan?.id}/tasks/${taskStore.task?.id}`,
          disabled: false,
        },
      ];
    }
    if (!taskStore.task && !taskStore.loading) {
      navigateTo(`/courses/${route.params.id}/tasks`);
    }
  },
);
</script>

<style scoped></style>
