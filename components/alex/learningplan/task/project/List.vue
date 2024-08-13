<template>
  <div v-if="learningPlanStore.learningPlan">
    <Transition name="slide">
      <v-expansion-panels
        v-model="expandBacklog"
        class="task-accordion my-6 rounded-lg"
      >
        <v-expansion-panel class="rounded-lg">
          <v-expansion-panel-title class="cursor-default" disabled hide-actions>
            <v-icon
              :icon="
                expandBacklog === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'
              "
              @click="toggleExpand"
            />
            <span class="text-h5 text-gray-800">{{
              taskSections[backlogIndex - 1]
            }}</span>
            <alex-custom-chip
              status="secondary"
              size="small"
              :text="filteredTasks[backlogIndex - 1].length.toString()"
            ></alex-custom-chip>
            <alex-custom-button
              class="ml-auto"
              icon="mdi-plus"
              variant="text"
            />
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
                  :over="setOver(backlogIndex - 1)"
                  :drag-from="dragDrop.dragFrom.value"
                  :dragging="dragDrop.dragging.value"
                  @start-drag="dragDrop.startDrag"
                  @drag-over="dragDrop.onDragOver"
                  @drag-end="onDrop"
                  @drag-leave="dragDrop.onDragLeave"
                  @delete-task="handleDeleteTask"
                  @move-task="handleMoveTask"
                  @toggle-archive="handleToggleArchive"
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
    </Transition>
    <div class="tw-flex tw-w-full tw-justify-between">
      <h5 class="text-h5 text-gray-800">Lista de Sprints</h5>
      <alex-custom-button size="large" prepend-icon="alex:Sprint">{{
        'Nova Sprint'
      }}</alex-custom-button>
    </div>
    <alex-learningplan-task-project-sprints
      v-model="sprints"
      v-model:drag-drop="dragDrop"
      :search="search"
      :learning-plan-id="learningPlanStore.learningPlan.id"
      @drag-end="onDrop"
    />
  </div>
</template>

<script setup lang="ts">
import { PanelItem, Sprint } from './Sprints.vue';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { useMultipleDragDrop } from '~/composables/useMultipleDragDrop';
import { ApplicationError } from '~/models/simple/applicationError.model';
import { TaskStatus, TaskType } from '~/models/simple/taskSimple.model';

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

const props = defineProps<{
  search: string;
  filter: filterType | undefined;
}>();

const { create, delete: _delete, update } = useStrapi();
// const client = useStrapiClient();
const { t } = useI18n();
const expandBacklog = ref(0);
const sprints = ref<PanelItem<Sprint>[]>([
  {
    expanded: 0,
    group: `sprint-${1}`,
    raw: {
      id: 1,
      name: 'Sprint 1',
      startDate: new Date(),
      endDate: new Date(),
      tasks: [
        {
          id: 4,
          position: 0,
          title: 'test',
          start_at: '2024-07-22',
          finish_at: '2024-08-01',
          type: 'individual',
          status: 'draft',
          delivered: { toDo: 1, completed: 0, doing: 0, underReview: 0 },
        },
      ],
    },
  },
  {
    expanded: 0,
    group: `sprint-${2}`,
    raw: {
      id: 2,
      name: 'Sprint 2',
      startDate: new Date(),
      endDate: new Date(),
      tasks: [
        {
          id: 1,
          position: 0,
          title: 'test',
          start_at: '2024-09-22',
          finish_at: '2024-11-22',
          type: 'individual',
          status: 'draft',
          delivered: { toDo: 1, completed: 0, doing: 0, underReview: 0 },
        },
        {
          id: 2,
          position: 2,
          title: 'tes2',
          start_at: '2024-09-22',
          finish_at: '2024-11-22',
          type: 'individual',
          status: 'draft',
          delivered: { toDo: 1, completed: 0, doing: 0, underReview: 0 },
        },
      ],
    },
  },
]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const teacherDrawer = ref(false);
const editTaskId = ref<number>(-1);
const dragDrop = useMultipleDragDrop();

// Static variables
const backlogIndex: number = 1;
const groupsArray = ['backlog'];
const groups = {};
const taskSections = [t('pages.task.backlog')];
const searchField = computed(() => props.search.toLowerCase());
const sprintGroups = computed(() =>
  sprints.value.map((sprint) => sprint.group),
);
const tasksFilter = computed(() => props.filter);
const isFilterActive = computed(() => {
  if (tasksFilter.value) return Object.keys(tasksFilter.value).length !== 0;
  return false;
});
const filteredTasks = computed(() => {
  const backlog = backlogTasks.value.filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  );
  return [backlog];
});

const backlogTasks = computed(() => {
  const backlog: TaskItem[] = [
    // {
    //   id: 7,
    //   position: 0,
    //   title: 'test',
    //   start_at: '2024-09-22',
    //   finish_at: '2024-11-22',
    //   type: 'individual',
    //   status: 'draft',
    //   delivered: { toDo: 1, completed: 0, doing: 0, underReview: 0 },
    // },
  ];
  return backlog;
});

const slideTransition = () =>
  backlogTasks.value.length ? 'slide-down' : 'slide-up';
const displayError = (message: string, e?: ApplicationError) => {
  let displayMessage = t('pages.task.crud.errorMessage', {
    action: t(`pages.task.crud.${message}`),
  });
  const error = e?.error;
  if (error?.name === 'ApplicationError' && error?.details) {
    displayMessage = t(`pages.task.crud.${error.details.errCode}`);
  }
  setMessage(displayMessage, 'error', true);
  if (learningPlanStore.learningPlan)
    learningPlanStore.loadLearningPlan(learningPlanStore.learningPlan.id, true);
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
    const deleteIndex = learningPlanStore.learningPlan?.tasks.findIndex(
      (task) => task.id === id,
    );
    if (typeof deleteIndex === 'number' && deleteIndex > -1) {
      learningPlanStore.learningPlan?.tasks.splice(deleteIndex, 1);
    }
    await _delete('tasks', id);
    displaySuccess('deleteSuccess');
  } catch (e) {
    displayError('deleteError');
  }
};

const handleMoveTask = async ({
  id,
  status,
}: {
  id: number;
  status: TaskStatus;
}) => {
  try {
    const taskPosition = getHigherIndex();
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.position = taskPosition;
      await update('tasks', id, { status, position: taskPosition });
      displaySuccess('moveSuccess');
    }
  } catch (e: any) {
    displayError('moveError', e);
  }
};

const handleToggleArchive = async (id: number) => {
  const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
  if (!task) return;
  try {
    if (task) {
      const newPosition = getHigherIndex();
      task.position = newPosition;
      task.archived_at = task.archived_at ? null : new Date().toISOString();
      await update('tasks', id, {
        archived_at: task.archived_at,
        position: newPosition,
      });
      displaySuccess(task.archived_at ? 'archiveSuccess' : 'unarchiveSuccess');
    }
  } catch (e) {
    displayError(task.archived_at ? 'archiveError' : 'unarchiveError');
  }
};

const setOver = (groupIndex: number) => {
  if (dragDrop.over.value.list === groups[groupIndex])
    return dragDrop.over.value;
  return { ...dragDrop.over.value, id: -1 };
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent) => {
  dragDrop.onDragOver('backlog', -index, -1, dragEvent);
};

// const updateTaskPositions = async (tasksStatus: TaskStatus, item: TaskItem) => {
//   const groupIndex = groups[tasksStatus];

//   const cloneArray = JSON.parse(JSON.stringify(backlogTasks.value[groupIndex]));

//   const task = learningPlanStore.learningPlan?.tasks.find(
//     (t) => t.id === item.id,
//   );

//   if (!task) return;

//   if (task?.status === tasksStatus) {
//     const removeIndex = cloneArray.findIndex((t: TaskItem) => t.id === task.id);
//     cloneArray.splice(removeIndex, 1);
//   }

//   let targeIndex = cloneArray.findIndex((t) => t.id === dragDrop.over.value.id);
//   targeIndex =
//     dragDrop.over.value.position === 'top' ? targeIndex : targeIndex + 1;
//   cloneArray.splice(targeIndex, 0, item);

//   task.status = tasksStatus;
//   item.status = tasksStatus;
//   await update('tasks', task.id, { status: tasksStatus });
//   await client('tasks/update-multiple', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: cloneArray,
//   });
//   backlogTasks.value[groupIndex] = cloneArray;
// };

const onDrop = (item: TaskItem, tableSort: string) => {
  if (dragDrop.over.value.list) {
    console.log('a', item, tableSort);
  }
  dragDrop.dragEnd();
};

const openDrawer = (id: number) => {
  editTaskId.value = id;
  teacherDrawer.value = true;
};

// lifeCycles
groupsArray.forEach((group, index) => {
  groups[group] = index;
  groups[index] = group;
});
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
