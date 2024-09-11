<script setup lang="ts">
import { useMultipleDragDrop } from '@/composables/useMultipleDragDrop';
import { ApplicationError } from '@/models/simple/applicationError.model';
import { TaskStatus } from '@/models/simple/taskSimple.model';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { isEmpty } from '@/utils/is-empty';
import { useQueryClient } from '@tanstack/vue-query';
import { useCreateTask, useDeleteTask, useUpdateTask } from '../-composables/useCreateTask';
import { SprintsResponse, useGetSprints } from '../-composables/useSprints';
import { Droppable, SprintTask } from '../-types';
import TaskSprint, { Sprint } from './TaskSprint.vue';
import TaskTable from './TaskTable.vue';

const props = defineProps<{
  filter?: filterType;
  search: string;
}>();

const { t } = useI18n();

const { setMessage } = useMessageStore();
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const learningPlanStore = useLearningPlanStore();
const dragDrop = useMultipleDragDrop();

const expandBacklog = ref(0);
const createSprintDialog = ref(false);

// Querys
const queryClient = useQueryClient();
const { data: sprintsValue, refetch: refetchSprints } = useGetSprints(learninplanId);
const { mutateAsync: createTask, isPending: isCreatingTaskRequest } = useCreateTask(learninplanId, queryClient);
const { mutateAsync: deleteTask } = useDeleteTask(learninplanId, queryClient);
const { mutateAsync: updateTask } = useUpdateTask();
const sprints = ref<Droppable<Sprint>[]>([]);

// refs
const isCreatingTask = ref(false);
const taskTitle = ref('');
const editTask = ref<SprintTask | null>(null);
const isEditingTask = ref<null | SprintTask>(null);
const backlogIndex = 1;
const taskSections = [t('pages.projects.tasks.backlog')];

const editSprints = [
  {
    text: t('pages.projects.tasks.add_epic'),
    onClick: () => {
      handleAddEpic();
    },
  },
  {
    text: t('pages.projects.tasks.add_task'),
    onClick: () => {
      handleAddTask();
    },
  },
];

// Computed
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
  return sprintsValue.value.backlog.filter((task) => contains(task.title, props.search));
});

// Methods

const handleAddEpic = () => {
  const newTask = {
    id: Math.round(Math.random() * 123456),
    position: getHigherIndex(),
    status: 'draft',
    title: '',
    children: [],
    organization: 'epic',
    local: true,
  } as SprintTask;
  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return {
      ...oldData,
      backlog: [...oldData.backlog, newTask],
    };
  });
  isEditingTask.value = newTask;
};
const handleAddTask = () => {
  const newTask = {
    id: Math.round(Math.random() * 123456),
    position: getHigherIndex(),
    status: 'draft',
    title: '',
    children: [],
    organization: 'epic',
    local: true,
  } as SprintTask;
  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return {
      ...oldData,
      backlog: [
        ...oldData.backlog,
        {
          id: Math.round(Math.random() * 123456),
          position: getHigherIndex(),
          status: 'draft',
          title: '',
          organization: 'standard',
        },
      ],
    };
  });
  isEditingTask.value = newTask;
};
const handleAddStory = (id: number) => {
  const newTask = {
    id: Math.round(Math.random() * 123456),
    position: getHigherIndex(),
    status: 'draft',
    title: '',
    children: [],
    organization: 'story',
    local: true,
  } as SprintTask;
  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    const updatedBacklog = oldData.backlog.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          children: task.children?.length ? [...task.children, newTask] : [newTask],
        };
      }
      return task;
    });
    return {
      ...oldData,
      backlog: updatedBacklog,
    };
  });
  isEditingTask.value = newTask;
};

const getSlideTransition = () => {
  return sprintsValue.value.backlog.length ? 'slide-down' : 'slide-up';
};

const getHigherIndex = () => {
  const tasks = sprintsValue.value.backlog;
  return tasks[tasks.length - 1]?.position + 1 || 0;
};

const handleCreateTask = async () => {
  if (taskTitle.value && learningPlanStore.learningPlan && learningPlanStore.learningPlan.id) {
    const learningPlanId = learningPlanStore.learningPlan.id;
    const higherIndex = getHigherIndex();
    await createTask({
      title: taskTitle.value,
      learningPlanId,
      position: higherIndex,
    });
  }
  taskTitle.value = '';
  isCreatingTask.value = false;
};

const showErrorMessage = (message: string, err?: ApplicationError) => {
  const displayMessage =
    err?.error?.name === 'ApplicationError' && err?.error?.details
      ? t(`pages.projects.tasks.${err.error.details.errCode}`)
      : t('pages.projects.tasks.error_message', { action: t(`pages.projects.tasks.${message}`) });

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

  sprintsValue.value.backlog = sprintsValue.value.backlog.map((task) => {
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
    await deleteTask({ id });
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
    const task = sprintsValue.value.backlog.find((t) => t.id === id);
    if (task) {
      const position = getHigherIndex();
      await updateTask({ id, status, position });
      await refetchSprints();
      showSuccessMessage('moveSuccess');
    }
  } catch (err: any) {
    showErrorMessage('moveError', err);
  }
};

const showSuccessMessage = (message: string) => {
  setMessage(
    t('pages.projects.tasks.successMessage', { action: t(`pages.projects.tasks.${message}`) }),
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
                <div v-if="!sprintsValue.backlog.length && backlogIndex">
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
                    :is-editing-task="isEditingTask"
                    :over="setOver"
                    :search="search"
                    :sprints="sprintGroups"
                    :tasks="sprintsValue.backlog"
                    @add-story="handleAddStory"
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
                    :loading="isCreatingTaskRequest"
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
                      :disabled="isCreatingTaskRequest"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask"
                      @keyup.esc="isCreatingTask = false"
                    />
                    <alex-custom-button size="large" :loading="isCreatingTaskRequest" @click="handleCreateTask">
                      {{ $t('pages.projects.tasks.add_task') }}
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
    <alex-learningplan-task-drawer-project
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
