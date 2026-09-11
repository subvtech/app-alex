<script setup lang="ts">
import { useMultipleDragDrop } from '@/composables/useMultipleDragDrop';
import { ApplicationError } from '@/models/simple/applicationError.model';
import { TaskStatus, TaskType } from '@/models/simple/taskSimple.model';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { isEmpty } from '@/utils/is-empty';

export interface TaskItem {
  id: number;
  title: string;
  status: TaskStatus;
  finish_at?: string | null;
  start_at?: string | null;
  position: number;
  type?: TaskType | null;
  archived_at?: string | null;
  students?: { name: string; image?: { url: string } }[];
  delivered: {
    toDo: number;
    doing: number;
    underReview: number;
    completed: number;
  };
}

interface Sprint {
  expanded: number;
  group: string;
  raw: {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    tasks: TaskItem[];
  };
}

const props = defineProps<{
  search: string;
  filter: filterType | undefined;
}>();

const { create, delete: _delete, update } = useStrapi();
const strapiClient = useStrapiClient();
const { t } = useI18n();
const expandBacklog = ref(0);
const createSprintDialog = ref(false);
const backlogTasks = ref<TaskItem[]>([]);
const sprintTasks = ref<TaskItem[]>([]);
const sprints = ref<Sprint[]>([]);

const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const teacherDrawer = ref(false);
const editTaskId = ref(-1);
const dragDrop = useMultipleDragDrop();

const backlogIndex = 1;
const groupsArray = ['backlog'];
const groups = {};
const taskSections = [t('pages.task.backlog')];

const searchField = computed(() => props.search.toLowerCase());
const sprintGroups = computed(() => sprints.value.map((s) => s.group));
const isFilterActive = computed(() => !isEmpty(props.filter));

const filteredTasks = computed(() => {
  return backlogTasks.value.filter((task) => task.title.toLowerCase().includes(searchField.value.toLowerCase()));
});

const slideTransition = () => {
  return backlogTasks.value.length ? 'slide-down' : 'slide-up';
};

const displayError = (message: string, err?: ApplicationError) => {
  const displayMessage =
    err?.error?.name === 'ApplicationError' && err?.error?.details
      ? t(`pages.task.crud.${err.error.details.errCode}`)
      : t('pages.task.crud.errorMessage', {
          action: t(`pages.task.crud.${message}`),
        });

  setMessage(displayMessage, 'error', true);

  if (learningPlanStore.learningPlan) {
    learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id, true);
  }
};

const displaySuccess = (message: string) => {
  setMessage(
    t('pages.task.crud.successMessage', {
      action: t(`pages.task.crud.${message}`),
    }),
    'success',
    true,
  );
};

const getHigherIndex = () => {
  const tasks = backlogTasks.value;
  return tasks[tasks.length - 1]?.position + 1 || 0;
};

const handleCreateTask = async () => {
  if (taskTitle.value) {
    loader.value = true;

    const learningPlanId = learningPlanStore.learningPlan?.id;
    if (!learningPlanId) return;

    const higherIndex = getHigherIndex();

    try {
      const res = await create('tasks', {
        title: taskTitle.value,
        status: 'draft' as TaskStatus,
        learningplan: learningPlanId,
        position: higherIndex,
        allowed_editor_plugins: '',
        submission_description: '',
        submission_required: false,
        can_submit_after_deadline: false,
        can_change_from_review: false,
      });

      learningPlanStore.learningPlan?.tasks.push({
        id: res.data.id,
        learning_plan_id: learningPlanId,
        learning_goals: [],
        trail: undefined,
        task_events: undefined,
        task_members: undefined,
        tags: undefined,
        ...res.data.attributes,
      });

      displaySuccess('addSuccess');
    } catch (e) {
      displayError('addError');
    }
  }

  loader.value = false;
  taskTitle.value = '';
  isCreatingTask.value = false;
};

const toggleExpand = () => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expandBacklog.value = !expandBacklog.value ? 1 : 0;
};

const handleDeleteTask = async (id: number) => {
  try {
    const deleteIndex = learningPlanStore.learningPlan?.tasks.findIndex((task) => task.id === id);

    if (+deleteIndex! > -1) {
      learningPlanStore.learningPlan?.tasks.splice(deleteIndex!, 1);
    }

    await _delete('tasks', id);
    displaySuccess('deleteSuccess');
  } catch (e) {
    displayError('deleteError');
  }
};

const handleMoveTask = async ({ id, status }: { id: number; status: TaskStatus }) => {
  try {
    const taskPosition = getHigherIndex();
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);

    if (task) {
      task.status = status;
      task.position = taskPosition;
      await update('tasks', id, { status, position: taskPosition });
      displaySuccess('moveSuccess');
    }
  } catch (err: any) {
    displayError('moveError', err);
  }
};

const setOver = () => {
  if (dragDrop.over.value.list === 'backlog') return dragDrop.over.value;
  return { ...dragDrop.over.value, id: -1 };
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent) => {
  dragDrop.onDragOver('backlog', -index, -1, dragEvent);
};

const editSprints = [
  {
    text: 'Adicionar épico',
    action: () => {
      console.log('Adicionar épico');
    },
  },
  {
    text: 'Adicionar tarefa',
    action: () => {
      console.log('Adicionar tarefa');
    },
  },
];

const openDrawer = (id: number) => {
  editTaskId.value = id;
  teacherDrawer.value = true;
};

groupsArray.forEach((group, index) => {
  groups[group] = index;
  groups[index] = group;
});

onMounted(async () => {
  try {
    const res = await strapiClient<{
      backlog: TaskItem[];
      sprints: TaskItem[];
    }>(`/learningplans/${learningPlanStore.learningPlan?.id}/sprint-backlog`);

    backlogTasks.value = res.backlog;
    sprintTasks.value = res.sprints;
  } catch (_) {}
});
</script>

<template>
  <div v-if="learningPlanStore.learningPlan">
    <Transition name="slide">
      <v-expansion-panels v-model="expandBacklog" class="task-accordion my-6 rounded-lg">
        <v-expansion-panel class="rounded-lg">
          <v-expansion-panel-title class="tw-cursor-default" disabled hide-actions>
            <v-icon :icon="expandBacklog === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="toggleExpand" />
            <span class="text-h5 text-gray-800">
              {{ taskSections[backlogIndex - 1] }}
            </span>
            <alex-custom-chip status="secondary" size="small" :text="filteredTasks.length.toString()" />
            <div class="ml-auto">
              <alex-custom-dropdown variant="text" icon="mdi-plus" :items="editSprints" />
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Transition :name="slideTransition()" mode="out-in">
              <div v-if="!backlogTasks.length && backlogIndex">
                <alex-learningplan-task-empty-state
                  key="empty-state"
                  type="backlog"
                  :index="backlogIndex"
                  :drop-area="dragDrop.over.value.list === 'backlog'"
                  @drag-over="handleEmptyStateOver"
                  @drag-leave="dragDrop.onDragLeave"
                />
              </div>
              <div v-else>
                <alex-learningplan-task-project-table
                  key="table"
                  group="backlog"
                  :sprints="sprintGroups"
                  :tasks="backlogTasks"
                  :search="search"
                  :active-filter="isFilterActive"
                  :over="setOver"
                  :is-project="true"
                  :drag-from="dragDrop.dragFrom.value"
                  :dragging="dragDrop.dragging.value"
                  @start-drag="dragDrop.startDrag"
                  @drag-over="dragDrop.onDragOver"
                  @drag-leave="dragDrop.onDragLeave"
                  @delete-task="handleDeleteTask"
                  @move-task="handleMoveTask"
                  @edit-task="openDrawer"
                />
              </div>
            </Transition>
            <div v-if="backlogIndex === 1" class="mb-4">
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
                    autofocus
                    :placeholder="t('pages.task.addPlaceholder')"
                    class="w-100"
                    density="comfortable"
                    name="taskTitle"
                    hide-details
                    :disabled="loader"
                    @keyup.esc="isCreatingTask = false"
                    @keyup.enter="handleCreateTask"
                  />
                  <alex-custom-button size="large" :loading="loader" @click="handleCreateTask">
                    {{ $t('pages.task.addButton') }}
                  </alex-custom-button>
                </div>
              </Transition>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </Transition>
    <div class="tw-flex tw-w-full tw-justify-between">
      <h5 class="text-h5 text-gray-800">Lista de Sprints</h5>
      <alex-custom-button size="large" prepend-icon="alex:Sprint" @click="createSprintDialog = true">
        {{ 'Nova Sprint' }}
      </alex-custom-button>
    </div>
    <alex-learningplan-task-project-sprints
      v-model="sprints"
      v-model:drag-drop="dragDrop"
      :search="search"
      :learning-plan-id="learningPlanStore.learningPlan.id"
      :edit-sprints="editSprints"
    />
    <alex-project-dialogs-sprint
      v-model="createSprintDialog"
      :project-id="learningPlanStore.learningPlan.id"
      :project-start-date="learningPlanStore.learningPlan.start_date"
      :project-end-date="learningPlanStore.learningPlan.end_date"
      :sprints-length="sprints.length"
    />
  </div>
</template>

<style>
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
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to,
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-enter-active {
  transition: all 0.5s ease-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
