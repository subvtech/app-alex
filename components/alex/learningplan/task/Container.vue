<template>
  <div v-for="i in 4" :key="i">
    <Transition name="slide">
      <v-expansion-panels
        v-if="shouldDisplay(i)"
        v-model="expand[i - 1]"
        class="task-accordion my-6 rounded-lg"
      >
        <v-expansion-panel class="rounded-lg">
          <v-expansion-panel-title class="cursor-default" disabled hide-actions>
            <v-icon
              :icon="
                expand[i - 1] === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'
              "
              @click="toggleExpand(i)"
            />
            <span class="text-h5 text-gray-800">{{ taskSections[i - 1] }}</span>
            <alex-custom-chip
              status="secondary"
              :text="filteredTasks[i - 1].toString()"
            ></alex-custom-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Transition :name="slideTransition(i)" mode="out-in">
              <div v-if="!tasksArray[i - 1].length && i">
                <alex-learningplan-task-empty-state
                  key="empty-state"
                  :index="i"
                  :drop-area="over.list === groups[i - 1]"
                  @drag-over="handleEmptyStateOver"
                  @drag-leave="onDragLeave"
                />
              </div>
              <div v-else>
                <alex-learningplan-task-table
                  key="table"
                  :index="i"
                  :tasks="tasksArray[i - 1]"
                  :search="search"
                  :active-filter="isFilterActive"
                  :group="groups[i - 1]"
                  :over="setOver(i - 1)"
                  :drag-from="dragFrom"
                  :dragging="dragging"
                  @start-drag="startDrag"
                  @drag-over="onDragOver"
                  @drag-end="onDrop"
                  @drag-leave="onDragLeave"
                  @delete-task="handleDeleteTask"
                  @move-task="handleMoveTask"
                  @toggle-archive="handleToggleArchive"
                />
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { useMultipleDragDrop } from '~/composables/useMultipleDragDrop';

export interface TaskType {
  id: number;
  title: string;
  status: string;
  deadline_at?: string;
  position: number;
  type?: 'group' | 'individual';
  archived?: boolean;
  students?: { name: string; image: { url: string } }[];
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
const { t } = useI18n();
const expand = ref([0, 0, 0, 0]);
const isCreatingTask = ref(false);
const taskTitle = ref('');
const loader = ref(false);
const route = useRoute();
const { setMessage } = useMessageStore();
const learningPlanStore = useLearningPlanStore();
const slideTransition = (i: number) =>
  tasksArray.value[i - 1].length ? 'slide-down' : 'slide-up';

const groupsArray = ['draft', 'published', 'done', 'archived'];
const groups = {};

groupsArray.forEach((group, index) => {
  groups[group] = index;
  groups[index] = group;
});

const searchField = computed(() => props.search.toLowerCase());
const tasksFilter = computed(() => props.filter);
const isFilterActive = computed(() => {
  if (tasksFilter.value) return Object.keys(tasksFilter.value).length !== 0;
  return false;
});

const shouldDisplay = (i: number) => {
  const { archivedTasks } = tasksFilter.value || {};
  return (!archivedTasks && i !== 4) || (i === 4 && archivedTasks);
};
const displayError = (message: string) => {
  setMessage(
    t('pages.task.crud.errorMessage', {
      action: t(`pages.task.crud.${message}`),
    }),
    'error',
    true,
  );
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

const isDateInRange = (date: Date, range) => {
  if (!range) return true;
  if (!date) return false;
  const { start, end } = range;
  if (start && new Date(date) < new Date(start)) return false;
  if (end && new Date(date) > new Date(end)) return false;
  return true;
};

const getHigherIndex = (taskStatus: string) => {
  const tasks = tasksArray.value[groups[taskStatus]];
  return tasks[tasks.length - 1]?.position + 1 || 0;
};

const handleCreateTask = async () => {
  loader.value = true;
  const higherIndex = getHigherIndex('draft');
  try {
    const res = await create('tasks', {
      title: taskTitle.value,
      status: 'draft',
      learningplan: route.params.id,
      start_at: new Date(),
      position: higherIndex,
    });
    learningPlanStore.learningPlan?.tasks.push({
      id: res.data.id,
      ...res.data.attributes,
    });
    displaySuccess('addSuccess');
  } catch (e) {
    displayError('addError');
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
  t('pages.task.archived'),
];

const tasksArray = computed(() => {
  const draft: TaskType[] = [];
  const published: TaskType[] = [];
  const closed: TaskType[] = [];
  const archived: TaskType[] = [];
  learningPlanStore.learningPlan?.tasks
    .sort((a, b) => (a.position > b.position ? 1 : -1))
    .forEach((task) => {
      const delivered = {
        toDo: 0,
        doing: 0,
        underReview: 0,
        completed: 0,
      };
      if (tasksFilter.value?.select && task.type !== tasksFilter.value?.select)
        return;
      if (!isDateInRange(task.start_at, tasksFilter.value?.startDate)) return;
      if (!isDateInRange(task.deadline_at, tasksFilter.value?.finalDate))
        return;

      const students = task.task_members?.map((student) => {
        if (student.status === 'to_do') delivered.toDo += 1;
        if (student.status === 'in_progress') delivered.doing += 1;
        if (student.status === 'in_review') delivered.underReview += 1;
        if (student.status === 'done') delivered.completed += 1;
        return {
          name: student.student_member?.user?.fullname,
          image: { url: student.student_member?.user?.avatar.url },
        };
      });

      const taskItem = {
        id: task.id,
        title: task.title,
        status: task.status,
        deadline_at: task.deadline_at,
        start_at: task.start_at,
        type: task.type,
        archived: task.archived,
        position: task.position,
        students,
        delivered,
      };
      if (task.archived) archived.push(taskItem);
      else if (task.status === 'draft') draft.push(taskItem);
      else if (task.status === 'published') published.push(taskItem);
      else if (task.status === 'done') closed.push(taskItem);
    });
  return [draft, published, closed, archived];
});

const filteredTasks = computed(() => {
  const draft = tasksArray.value[0].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const published = tasksArray.value[1].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const closed = tasksArray.value[2].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;
  const archived = tasksArray.value[3].filter((task) =>
    task.title.toLowerCase().includes(searchField.value.toLowerCase()),
  ).length;

  return [draft, published, closed, archived];
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
  status: string;
}) => {
  try {
    const taskPosition = getHigherIndex(status);
    const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
    if (task) {
      task.status = status;
      task.position = taskPosition;
      await update('tasks', id, { status, position: taskPosition });
      displaySuccess('moveSuccess');
    }
  } catch (e) {
    displayError('moveError');
  }
};

const handleToggleArchive = async (id: number) => {
  const task = learningPlanStore.learningPlan?.tasks.find((t) => t.id === id);
  try {
    if (task) {
      task.archived = !task.archived;
      await update('tasks', id, { archived: task.archived });
      displaySuccess(task.archived ? 'archiveSuccess' : 'unarchiveSuccess');
    }
  } catch (e) {
    displayError(task.archived ? 'archiveError' : 'unarchiveError');
  }
};

const {
  over,
  dragFrom,
  dragging,
  startDrag,
  dragEnd,
  onDragOver,
  onDragLeave,
} = useMultipleDragDrop();

const setOver = (groupIndex: number) => {
  if (over.value.list === groups[groupIndex]) return over.value;
  return { ...over.value, id: -1 };
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent) => {
  onDragOver(groups[index - 1], -index, -1, dragEvent);
};

const updateTaskPositions = (tasksStatus: string, item: TaskType) => {
  const groupIndex = groups[tasksStatus];

  const cloneArray = JSON.parse(JSON.stringify(tasksArray.value[groupIndex]));

  const task = learningPlanStore.learningPlan?.tasks.find(
    (t) => t.id === item.id,
  );

  if (task.status === tasksStatus) {
    const removeIndex = cloneArray.findIndex((t: TaskType) => t.id === task.id);
    cloneArray.splice(removeIndex, 1);
  }

  let targeIndex = cloneArray.findIndex((t) => t.id === over.value.id);
  targeIndex = over.value.position === 'top' ? targeIndex : targeIndex + 1;
  cloneArray.splice(targeIndex, 0, item);

  task.status = tasksStatus;
  item.status = tasksStatus;
  cloneArray.forEach((t: TaskType, index: number) => {
    if (t.position !== index || t.id === task.id) {
      t.position = index;
      if (t.id === task.id) {
        update('tasks', t.id, { position: index, status: tasksStatus });
      } else update('tasks', t.id, { position: index });
    }
  });
  tasksArray.value[groupIndex] = cloneArray;
};

const onDrop = async (item: TaskType, tableSort: string) => {
  if (over.value.list) {
    const task = learningPlanStore.learningPlan?.tasks.find(
      (t) => t.id === item.id,
    );
    if (
      task.status === over.value.list &&
      (over.value.index === -1 || isFilterActive.value)
    ) {
      const message = isFilterActive.value
        ? t('pages.task.crud.dndFilterError')
        : t('pages.task.crud.dndSortError', {
            type: t(`pages.task.table.header.${tableSort}`).toLowerCase(),
          });
      setMessage(message, 'warning', true, false, true);
    } else if (task) {
      try {
        if (over.value.index === -1) {
          task.position = getHigherIndex(over.value.list);
          task.status = over.value.list;
          await update('tasks', item.id, {
            status: over.value.list,
            position: getHigherIndex(over.value.list),
          });
        } else {
          updateTaskPositions(over.value.list, item);
        }
        displaySuccess('moveSuccess');
      } catch (e) {
        displayError('moveError');
      }
    }
  }
  dragEnd();
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
