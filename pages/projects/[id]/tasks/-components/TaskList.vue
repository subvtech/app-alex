<script setup lang="ts">
import { useMultipleDragDrop } from '@/composables/useMultipleDragDrop';
import { ApplicationError } from '@/models/simple/applicationError.model';
import { TaskStatus } from '@/models/simple/taskSimple.model';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { isEmpty } from '@/utils/is-empty';
import { Droppable, SprintTask } from '../-types';
import TaskSprint, { Sprint } from './TaskSprint.vue';
import TaskTable from './TaskTable.vue';

const props = defineProps<{
  filter?: filterType;
  search: string;
}>();

const { t } = useI18n();
const { create, delete: _delete, update } = useStrapi();
const { setMessage } = useMessageStore();
const strapiClient = useStrapiClient();
const learningPlanStore = useLearningPlanStore();
const dragDrop = useMultipleDragDrop();

const expandBacklog = ref(0);
const createSprintDialog = ref(false);
const backlogTasks = ref<SprintTask[]>([]);
const sprintTasks = ref<SprintTask[]>([]);
const sprints = ref<Droppable<Sprint>[]>([]);

const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const editTask = ref<SprintTask | null>(null);

const backlogIndex = 1;
const taskSections = [t('pages.projects.backlog')];

const editSprints = [
  {
    text: t('pages.projects.add_epic'),
    onClick: () => {
      console.log(t('pages.projects.add_epic'));
    },
  },
  {
    text: t('pages.projects.add_task'),
    onClick: () => {
      console.log(t('pages.projects.add_task'));
    },
  },
];

const sprintGroups = computed(() => sprints.value.map((s) => s.group));
const isFilterActive = computed(() => !isEmpty(props.filter));

const teacherDrawer = computed({
  get() {
    return !!editTask.value;
  },
  set(value: boolean) {
    editTask.value = !value ? null : editTask.value;
  },
});

const filteredTasks = computed(() => {
  return backlogTasks.value.filter((task) => contains(task.title, props.search));
});

const getSlideTransition = () => {
  return backlogTasks.value.length ? 'slide-down' : 'slide-up';
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

      showSuccessMessage('addSuccess');
    } catch (e) {
      showErrorMessage('addError');
    }
  }

  loader.value = false;
  taskTitle.value = '';
  isCreatingTask.value = false;
};

const showErrorMessage = (message: string, err?: ApplicationError) => {
  const displayMessage =
    err?.error?.name === 'ApplicationError' && err?.error?.details
      ? t(`pages.projects.tasks.crud.${err.error.details.errCode}`)
      : t('pages.projects.tasks.crud.errorMessage', { action: t(`pages.projects.tasks.crud.${message}`) });

  setMessage(displayMessage, 'error', true);

  if (learningPlanStore.learningPlan) {
    learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id, true);
  }
};

const handleChangeValues = (values: Partial<TaskSimple>) => {
  const editTaskId = editTask.value!.id;

  const updateTaskList = (tasks: SprintTask[]) => {
    for (const task of tasks) {
      if (task.id === editTaskId) {
        for (const key in values) {
          if (values[key] !== undefined) task[key] = values[key];
        }
      }

      if (task.children) updateTaskList(task.children);
    }
  };

  backlogTasks.value = backlogTasks.value.map((task) => {
    if (task.id === editTask.value?.id) {
      return Object.keys(editTask.value).reduce((acc, key) => {
        return values[key] ? { ...acc, [key]: values[key] } : acc;
      }, editTask.value);
    }

    if (task.children) updateTaskList(task.children);

    return task;
  });
};

const handleDeleteTask = async (id: number) => {
  try {
    const deleteIndex = learningPlanStore.learningPlan?.tasks.findIndex((task) => task.id === id);

    if (+deleteIndex! > -1) {
      learningPlanStore.learningPlan?.tasks.splice(deleteIndex!, 1);
    }

    await _delete('tasks', id);
    showSuccessMessage('deleteSuccess');
  } catch (e) {
    showErrorMessage('deleteError');
  }
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent) => {
  dragDrop.onDragOver('backlog', -index, -1, dragEvent);
};

const handleMoveTask = async ({ id, status }: { id: number; status: TaskStatus }) => {
  try {
    const taskPosition = getHigherIndex();
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);

    if (task) {
      task.status = status;
      task.position = taskPosition;
      await update('tasks', id, { status, position: taskPosition });
      showSuccessMessage('moveSuccess');
    }
  } catch (err: any) {
    showErrorMessage('moveError', err);
  }
};

const showSuccessMessage = (message: string) => {
  setMessage(
    t('pages.projects.tasks.crud.successMessage', { action: t(`pages.projects.tasks.crud.${message}`) }),
    'success',
    true,
  );
};

const setOver = () => {
  if (dragDrop.over.value.list === 'backlog') return dragDrop.over.value;
  return { ...dragDrop.over.value, id: -1 };
};

const toggleExpand = () => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expandBacklog.value = !expandBacklog.value ? 1 : 0;
};

onMounted(async () => {
  try {
    const res = await strapiClient<{
      backlog: SprintTask[];
      sprints: SprintTask[];
    }>(`/learningplans/${learningPlanStore.learningPlan?.id}/sprint-backlog`);

    backlogTasks.value = res.backlog;
    sprintTasks.value = res.sprints;
  } catch (_) {}
});
</script>

<template>
  <div>
    <div v-if="learningPlanStore.learningPlan">
      <Transition name="slide">
        <v-expansion-panels v-model="expandBacklog" class="task-accordion my-6 rounded-lg">
          <v-expansion-panel class="rounded-lg">
            <v-expansion-panel-title disabled hide-actions class="tw-cursor-default">
              <v-icon :icon="expandBacklog === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'" @click="toggleExpand" />
              <span class="text-h5 text-gray-800">
                {{ taskSections[backlogIndex - 1] }}
              </span>
              <alex-custom-chip size="small" status="secondary" :text="filteredTasks.length" />
              <div class="ml-auto">
                <alex-custom-dropdown icon="mdi-plus" variant="text" :items="editSprints" />
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <Transition mode="out-in" :name="getSlideTransition()">
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
                  <TaskTable
                    key="table"
                    group="backlog"
                    :active-filter="isFilterActive"
                    :drag-from="dragDrop.dragFrom.value"
                    :dragging="dragDrop.dragging.value"
                    :is-project="true"
                    :over="setOver"
                    :search="search"
                    :sprints="sprintGroups"
                    :tasks="backlogTasks"
                    @start-drag="dragDrop.startDrag"
                    @drag-over="dragDrop.onDragOver"
                    @drag-leave="dragDrop.onDragLeave"
                    @delete-task="handleDeleteTask"
                    @move-task="handleMoveTask"
                    @edit-task="(_id, task: SprintTask) => (editTask = task)"
                  />
                </div>
              </Transition>
              <div v-if="backlogIndex === 1" class="mb-4">
                <Transition mode="out-in" name="add-task">
                  <alex-custom-button
                    v-if="!isCreatingTask"
                    class="w-100 create-task-btn"
                    prepend-icon="mdi-plus"
                    size="large"
                    variant="text"
                    :loading="loader"
                    @click="isCreatingTask = true"
                  >
                    {{ $t('pages.projects.tasks.add') }}
                  </alex-custom-button>
                  <div v-else class="d-flex ga-2">
                    <alex-inputs-text-field
                      v-model="taskTitle"
                      autofocus
                      hide-details
                      class="w-100"
                      density="comfortable"
                      name="taskTitle"
                      :disabled="loader"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask"
                      @keyup.esc="isCreatingTask = false"
                    />
                    <alex-custom-button size="large" :loading="loader" @click="handleCreateTask">
                      {{ $t('pages.projects.tasks.add_button') }}
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
        <alex-custom-button prepend-icon="alex:Sprint" size="large" @click="createSprintDialog = true">
          {{ 'Nova Sprint' }}
        </alex-custom-button>
      </div>
      <TaskSprint
        v-model="sprints"
        v-model:drag-drop="dragDrop"
        :edit-sprints="editSprints"
        :learning-plan-id="learningPlanStore.learningPlan.id"
        :search="search"
      />
      <alex-project-dialogs-sprint
        v-model="createSprintDialog"
        :project-end-date="learningPlanStore.learningPlan.end_date"
        :project-id="learningPlanStore.learningPlan.id"
      />
    </div>
    <alex-learningplan-task-drawer-teacher
      v-model="teacherDrawer"
      editable
      :end-date="editTask?.finish_at"
      :learningplan-id="learningPlanStore.learningPlan?.id || 0"
      :start-date="editTask?.start_at"
      :status="editTask?.status"
      :task-id="editTask?.id"
      :title="editTask?.title"
      :type="editTask?.type"
      @change-values="handleChangeValues"
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
