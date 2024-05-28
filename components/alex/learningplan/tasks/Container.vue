<template>
  <v-expansion-panels
    v-for="i in 3"
    :key="i"
    v-model="expand[i - 1]"
    class="task-accordion my-6 rounded-lg"
  >
    <v-expansion-panel class="rounded-lg">
      <v-expansion-panel-title class="cursor-default" disabled hide-actions>
        <v-icon
          :icon="expand[i - 1] === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'"
          @click="toggleExpand(i)"
        />
        <span class="text-h5 text-gray-800">{{ taskSections[i - 1] }}</span>
        <alex-custom-chip
          status="secondary"
          :text="filteredTasks[i - 1].toString()"
        ></alex-custom-chip>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <Transition name="slide-up">
          <alex-learningplan-tasks-empty-state
            v-if="!tasksArray[i - 1].length"
            :index="i"
          />
          <alex-learningplan-tasks-table
            v-else-if="tasksArray[i - 1].length"
            :index="i"
            :tasks="tasksArray[i - 1]"
            :filter="search"
            @delete-task="handleDeleteTask"
            @move-task="handleMoveTask"
          />
        </Transition>
        <div v-if="i === 1" class="mb-4">
          <Transition mode="out-in" name="add-task">
            <alex-custom-button
              v-if="!isCreatingTask"
              size="large"
              variant="text"
              prepend-icon="mdi-plus"
              class="w-100 create-task-btn"
              :loading="loader"
              @click="isCreatingTask = true"
            >
              {{ $t('pages.task.add') }}
            </alex-custom-button>
            <div v-else class="d-flex ga-2">
              <alex-inputs-text-field
                v-model="taskTitle"
                :placeholder="t('pages.task.addPlaceholder')"
                class="w-100"
                density="comfortable"
                name="taskTitle"
                hide-details
                :disabled="loader"
                @keyup.enter="handleCreateTask"
              />
              <alex-custom-button
                size="large"
                :loading="loader"
                @click="handleCreateTask"
              >
                {{ $t('pages.task.addButton') }}
              </alex-custom-button>
            </div>
          </Transition>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
export interface TaskType {
  id: number;
  title: string;
  status: string;
  deadline_at: string;
  type?: string;
  archived?: boolean;
  students?: { name: string; avatar: { url: string } }[];
  delivered: {
    toDo: number;
    doing: number;
    underReview: number;
    completed: number;
  };
}

const props = defineProps<{
  search: string;
}>();

const { create, delete: _delete, update } = useStrapi();
const { t } = useI18n();
const expand = ref([0, 0, 0]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const route = useRoute();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();

const filter = computed(() => props.search.toLowerCase());

const handleCreateTask = async () => {
  loader.value = true;
  try {
    const res = await create('tasks', {
      title: taskTitle.value,
      status: 'draft',
      learningplan: route.params.id,
      start_at: new Date(),
    });
    learningPlanStore.learningPlan?.tasks.push({
      id: res.data.id,
      ...res.data.attributes,
    });
    setMessage(t('pages.task.crud.addSuccess'), 'success', true);
  } catch (e) {
    setMessage(t('pages.task.crud.addError'), 'error', true);
  }
  loader.value = false;
  taskTitle.value = '';
  isCreatingTask.value = false;
};
const toggleExpand = (index: number) => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expand.value[index - 1] = !expand.value[index - 1] ? -1 : 0;
};
const taskSections = [
  t('pages.task.draft'),
  t('pages.task.published'),
  t('pages.task.done'),
];

const tasksArray = computed(() => {
  const draft: TaskType[] = [];
  const published: TaskType[] = [];
  const closed: TaskType[] = [];

  learningPlanStore.learningPlan?.tasks.forEach((task) => {
    const delivered = {
      toDo: 0,
      doing: 0,
      underReview: 0,
      completed: 0,
    };

    const students = task.task_members?.map((student) => {
      if (student.status === 'to_do') delivered.toDo += 1;
      if (student.status === 'in_progress') delivered.doing += 1;
      if (student.status === 'in_review') delivered.underReview += 1;
      if (student.status === 'done') delivered.completed += 1;
      return {
        name: student.student_member.user.fullname,
        avatar: { url: student.student_member.user.avatar.url },
      };
    });

    const taskItem = {
      id: task.id,
      title: task.title,
      status: task.status,
      deadline_at: task.deadline_at,
      start_at: task.start_at,
      type: task.type,
      students,
      delivered,
    };

    if (task.status === 'draft') draft.push(taskItem);
    if (task.status === 'published') published.push(taskItem);
    if (task.status === 'done') closed.push(taskItem);
  });
  return [draft, published, closed];
});

const filteredTasks = computed(() => {
  const draft = tasksArray.value[0].filter((task) =>
    task.title.toLowerCase().includes(filter.value.toLowerCase()),
  ).length;
  const published = tasksArray.value[1].filter((task) =>
    task.title.toLowerCase().includes(filter.value.toLowerCase()),
  ).length;
  const closed = tasksArray.value[2].filter((task) =>
    task.title.toLowerCase().includes(filter.value.toLowerCase()),
  ).length;
  return [draft, published, closed];
});

const handleDeleteTask = async (id: number) => {
  try {
    const deleteIndex = learningPlanStore.learningPlan?.tasks.findIndex(
      (task) => task.id === id,
    );
    if (typeof deleteIndex === 'number' && deleteIndex > -1) {
      learningPlanStore.learningPlan?.tasks.splice(deleteIndex, 1);
    }
    await _delete('tasks', id);
    setMessage(t('pages.task.crud.deleteSuccess'), 'success', true);
  } catch (e) {
    setMessage(t('pages.task.crud.deleteError'), 'error', true);
    if (learningPlanStore.learningPlan)
      learningPlanStore.loadLearningPlan(
        learningPlanStore.learningPlan.id,
        true,
      );
  }
};

const handleMoveTask = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  try {
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      await update('tasks', id, { status });
      setMessage(t('pages.task.crud.moveSuccess'), 'success', true);
    }
  } catch (e) {
    setMessage(t('pages.task.crud.moveError'), 'error', true);
    if (learningPlanStore.learningPlan)
      learningPlanStore.loadLearningPlan(
        learningPlanStore.learningPlan.id,
        true,
      );
  }
};
</script>

<style>
.cursor-default {
  cursor: default;
}

.create-task-btn {
  border: 1px dashed rgb(var(--v-theme-gray-200));
}

.task-accordion {
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  border: solid 1px rgb(var(--v-theme-gray-200));
  .v-theme--mainTheme {
    --v-border-opacity: unset !important;
  }

  .v-expansion-panel-text__wrapper {
    padding: 0 16px !important;
  }

  .v-expansion-panel-title {
    transition: all 0.3s ease;
    height: 52px !important;
    justify-content: flex-start !important;
    gap: 8px;
    width: 100%;
    padding: 16px;
    background-color: transparent !important;
    border-radius: 16px;
  }

  .v-expansion-panel-title__overlay {
    display: none;
  }

  .v-expansion-panel-title--active {
    background-color: #fff !important;
    height: 60px !important;
    min-height: 60px !important;
  }

  .v-expansion-panel-title:hover:not(:has(.delete-btn:hover)) {
    background-color: #fff !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }

  .v-expansion-panel-title__icon {
    margin-inline-start: 0 !important;
  }

  .v-expansion-panel__shadow {
    display: none !important;
  }
}

.add-task-enter-active {
  transition: all 0.5s ease-in-out;
}

.add-task-enter-from,
.add-task-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
