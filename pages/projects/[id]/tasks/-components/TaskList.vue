<script setup lang="ts">
import { useMultipleDragDrop } from '@/composables/useMultipleDragDrop';
import { ApplicationError } from '@/models/simple/applicationError.model';
import { TaskSimple, TaskStatus } from '@/models/simple/taskSimple.model';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { isEmpty } from '@/utils/is-empty';
import { useQueryClient } from '@tanstack/vue-query';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR, enIN } from 'date-fns/locale';
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
const i18n = useI18n();

const { setMessage } = useMessageStore();
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const learningPlanStore = useLearningPlanStore();
const { update } = useStrapi();
const dragDrop = useMultipleDragDrop();

const expandBacklog = ref(0);
const expandSprints = ref<number[]>([]);
const showInputs = ref<boolean[]>([false]);
const tasksTitles = ref<string[]>([]);
const createSprintDialog = ref(false);

// Drag and drop
const hoveredSprint = ref<any | null>(0);
const hoveredTask = ref<any | null>(null);
const draggedTask = ref<any | null>(null);

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
const createTaskSprintId = ref<number>();
const editTask = ref<SprintTask>();
const isEditingTask = ref<null | TaskSimple>(null);
const backlogIndex = 1;
const taskSections = [t('pages.projects.tasks.backlog')];

const editSprints = () => {
  return [
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
};

// Computed
const sprintGroups = computed(() => sprints.value.map((s) => s.group));
const isFilterActive = computed(() => !isEmpty(props.filter));
const teacherDrawer = computed({
  get() {
    return !!editTask.value;
  },
  set(value: boolean) {
    editTask.value = !value ? undefined : editTask.value;
  },
});
const filteredTasks = computed(() => {
  return sprintsValue.value.backlog.filter((task) => contains(task.title, props.search));
});

const backlogTasks = computed(() => sprintsValue.value.backlog.map(formatTasks));
const sprintBacklog = computed(() => {
  expandSprints.value = new Array(sprintsValue.value.sprints.length).fill(0);
  showInputs.value = new Array(sprintsValue.value.sprints.length + 1).fill(false);
  tasksTitles.value = new Array(sprintsValue.value.sprints.length + 1).fill('');
  return sprintsValue.value.sprints.map((sprint) => ({
    ...sprint,
    tasks: sprint.tasks.map(formatTasks),
  }));
});

const formatTasks = (task) => {
  if (task.organization === 'epic' || task.organization === 'story') {
    return {
      ...task,
      tasks: task.tasks ? [...task.tasks] : [],
    };
  }
  return task;
};

const getHigherIndex = (sprintId?: number) => {
  const tasks = sprintId
    ? sprintsValue.value.sprints.filter((s) => s.id === sprintId)[0]?.tasks
    : sprintsValue.value.backlog;
  return tasks[tasks.length - 1]?.position + 1 || 0;
};

// Methods
// TODO: Logica de adicionar em uma sprint
const handleAddEpic = () => {
  const newTask = {
    id: Math.round(Math.random() * 1234526),
    position: getHigherIndex(),
    status: 'draft',
    title: '',
    tasks: [],
    organization: 'epic',
    local: true,
  } as any;
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

const handleAddTask = (task?: TaskSimple, sprintId?: number) => {
  const newTask = {
    id: Math.round(Math.random() * 123456),
    position: getHigherIndex(sprintId),
    status: 'draft',
    title: '',
    organization: 'standard',
    local: true,
    epic: task?.organization === 'story' ? task?.parent_task?.id : task?.id,
    story: task?.organization === 'story' ? task?.id : undefined,
    sprint: sprintId,
  } as any;

  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return {
        backlog: [],
        sprints: [],
      };
    }

    const data = structuredClone(oldData);

    const isSprint = !!sprintId;
    const sprintIdx = isSprint ? data.sprints.findIndex((s) => s.id === sprintId) : 0;
    const oldTasks = isSprint ? [...data.sprints[sprintIdx].tasks] : [...data.backlog];
    let newTasks: TaskSimple[] = [];
    if (!newTask.story && !newTask.epic) {
      newTasks = [...oldTasks, newTask];
    } else {
      const epicId = newTask.epic;
      const storyId = newTask.story;
      newTasks = oldTasks.map((epic) => {
        if (epic.id !== epicId) {
          return epic;
        }
        if (!storyId && epic.tasks) {
          epic.tasks = [...epic.tasks, newTask];
        } else {
          epic.tasks = epic.tasks?.map((story) => {
            if (story.id === storyId && story.tasks) {
              story.tasks = [...story.tasks, newTask];
            }
            return story;
          });
        }
        return epic;
      });

      if (isSprint) {
        const sprints = data.sprints;
        sprints[sprintIdx].tasks = newTasks;
        return {
          ...data,
          sprints,
        };
      } else {
        return {
          ...data,
          backlog: newTasks,
        };
      }
    }

    // return {
    //   ...oldData,
    //   backlog: [...oldData.backlog, newTask],
    // };
  });
  isEditingTask.value = newTask;
  if (sprintId) {
    createTaskSprintId.value = sprintId;
  }
};

const handleAddStory = (id: number) => {
  const newTask = {
    id: Math.round(Math.random() * 123456),
    position: getHigherIndex(),
    status: 'draft',
    title: '',
    tasks: [],
    organization: 'story',
    local: true,
    epic: id,
  } as any;
  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    const updatedBacklog = oldData.backlog.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          tasks: task.tasks?.length ? [...task.tasks, newTask] : [newTask],
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

const handleCreateTask = async (index: number, sprintId?: number) => {
  if (tasksTitles.value[index] && learningPlanStore.learningPlan && learningPlanStore.learningPlan.id) {
    const learningPlanId = learningPlanStore.learningPlan.id;
    const higherIndex = getHigherIndex();
    await createTask({
      title: tasksTitles.value[index],
      learningPlanId,
      position: higherIndex,
      organization: 'standard',
      sprint: sprintId,
    });
  }
  tasksTitles.value[index] = '';
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

const handleDelete = () => {
  queryClient.setQueryData<SprintsResponse>(['sprints', learninplanId], (oldData) => {
    if (!oldData) {
      return oldData;
    }
    let updatedBacklog = oldData.backlog.filter((task) => task.title);
    updatedBacklog = updatedBacklog.map((task) => ({
      ...task,
      tasks: task.tasks?.filter((task1) => task1.title),
    }));
    return {
      ...oldData,
      backlog: updatedBacklog,
    };
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

const createItem = async (task: SprintTask & { epic?: number; story?: number; sprint?: number }) => {
  await createTask({
    title: task.title,
    learningPlanId: learninplanId.value,
    organization: task.organization || 'standard',
    position: task.position,
    parentTask: task.story ? task.story : task.epic,
    sprint: task.sprint,
  });
  await refetchSprints();
};

const handleEdit = async (task: SprintTask) => {
  await updateTask(task);
  await refetchSprints();
};

const handleEmptyStateOver = (index: number, dragEvent: DragEvent, sprint = null) => {
  hoveredSprint.value = sprint ?? null;
  dragDrop.onDragOver('backlog', -index, -1, dragEvent);
};

const handleEmptyStateLeave = () => {
  setTimeout(() => {
    hoveredSprint.value = null;
  }, 300);
};

const handleMoveToParent = (parentTask) => {
  if (!draggedTask.value || !parentTask || parentTask?.organization === 'standard') {
    return;
  }

  if (parentTask?.tasks?.some((task) => Number(task.id) === Number(draggedTask.value.id))) {
    return;
  }

  update('tasks', draggedTask.value.id, {
    parent_task: parentTask.id,
  })
    .then(() => {
      setMessage(`Tarefa movida para ${parentTask.title}`, 'success', true);
      refetchSprints();
    })
    .catch(() => setMessage('Falha ao mover task', 'error', true));
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

// OnDrop
const onDrop = (_, __, e) => {
  const data = e?.target?.attributes?.id?.value;

  if (!data) {
    return;
  }

  const [id, name] = data.split(':');

  if (!hoveredSprint.value) {
    const name = setOver.value.list;
    hoveredSprint.value = sprintsValue.value.sprints.find(({ title }) => title === name) ?? null;
  }

  if (!hoveredSprint.value || !id) {
    hoveredSprint.value = null;
    dragDrop.dragEnd();
    return;
  }

  update('tasks', Number(id), {
    sprint: hoveredSprint.value.id,
    parent_task: null,
  })
    .then(() => {
      setMessage(`Tarefa ${name} para ${hoveredSprint.value.title}`, 'success', true);
      refetchSprints();
    })
    .catch(console.log)
    .finally(() => {
      hoveredSprint.value = null;
    });

  dragDrop.dragEnd();
};

// OnDropUtils;
// const getTaskGroup = (droppedTask: TaskSimple) => {
//   sprintsValue.value?.backlog?.forEach((task) => {
//     if (task.id === droppedTask.id) {
//       console.log('Ta no backlog');
//     }
//   });
// };

const updateTable = async (message) => {
  await refetchSprints();

  if (message) {
    setMessage(message, 'success', true);
  }
};

const showSuccessMessage = (message: string) => {
  setMessage(
    t('pages.projects.tasks.successMessage', { action: t(`pages.projects.tasks.${message}`) }),
    'success',
    true,
  );
};

const setOver = computed(() => {
  if (dragDrop.over.value.list === 'backlog') return dragDrop.over.value;
  return { ...dragDrop.over.value, id: -1 };
});

const toggleExpand = () => {
  isCreatingTask.value = false;
  taskTitle.value = '';
  expandBacklog.value = !expandBacklog.value ? 1 : 0;
};

const handleUpdateTask = (taskId, field) => {
  if (!taskId || !field) {
    return;
  }
  queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
};
const formattedDate = (strDate: string) => {
  const date = new Date(strDate);
  const dateFormat = date.getFullYear() === new Date().getFullYear() ? `d MMM` : `d MMM y`;
  return format(date, dateFormat, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  });
};

const handleInputBlur = (index: number) => {
  if (tasksTitles.value[index] === '') {
    showInputs.value[index] = false;
  }
};

const handleInputCancel = (index: number) => {
  tasksTitles.value[index] = '';
  showInputs.value[index] = false;
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
              <alex-custom-chip size="small" status="secondary" :text="`${filteredTasks.length}`" />
              <div class="ml-auto">
                <alex-custom-dropdown icon="mdi-plus" variant="text" :items="editSprints()" />
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
                    @drag-leave="(e) => dragDrop.onDragLeave(e)"
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
                    :tasks="backlogTasks"
                    @add-story="handleAddStory"
                    @add-task="handleAddTask"
                    @create-item="createItem"
                    @edit-item="handleEdit"
                    @handle-blur="handleDelete"
                    @start-drag="
                      (idVal, e, dropTo, dragGhost) => {
                        dragDrop.startDrag(idVal, e, dropTo, dragGhost);

                        const data = e?.target?.attributes?.id?.value;

                        if (!data) {
                          return;
                        }

                        const [id, title] = data.split(':');
                        draggedTask = { id, title };
                      }
                    "
                    @drag-over="
                      (sprint, idVal, index, e) => {
                        dragDrop.onDragOver(sprint, idVal, index, e);

                        const data = e?.target?.attributes?.id?.value;

                        if (!data) {
                          return;
                        }

                        const [id, title] = data.split(':');

                        hoveredTask = { id, title };
                      }
                    "
                    @drag-leave="dragDrop.onDragLeave"
                    @drag-end="
                      (_, __, e) => {
                        onDrop(_, __, e);
                        draggedTask = null;
                      }
                    "
                    @delete-task="handleDeleteTask"
                    @move-task="handleMoveTask"
                    @move-to-parent="handleMoveToParent"
                    @edit-task="(_id, task: SprintTask) => (editTask = task)"
                  />
                </div>
              </Transition>
              <div v-if="backlogIndex === 1" class="mb-4">
                <Transition mode="out-in" name="add-task">
                  <alex-custom-button
                    v-if="!showInputs[0]"
                    class="w-100 create-task-btn"
                    prepend-icon="mdi-plus"
                    size="large"
                    variant="text"
                    :loading="isCreatingTaskRequest"
                    @click="showInputs[0] = true"
                  >
                    {{ $t('pages.projects.tasks.add') }}
                  </alex-custom-button>
                  <div v-else class="d-flex ga-2">
                    <alex-inputs-text-field
                      v-model="tasksTitles[0]"
                      autofocus
                      hide-details
                      class="w-100"
                      density="comfortable"
                      name="taskTitle"
                      :disabled="isCreatingTaskRequest"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask(0)"
                      @keyup.esc="!showInputs[0]"
                      @blur="handleInputBlur(0)"
                    />
                    <alex-custom-button size="large" :loading="isCreatingTaskRequest" @click="handleCreateTask(0)">
                      {{ $t('pages.projects.tasks.add_task') }}
                    </alex-custom-button>
                    <alex-custom-button
                      size="large"
                      variant="tertiary"
                      :loading="isCreatingTaskRequest"
                      @click="handleInputCancel(0)"
                    >
                      {{ $t('pages.projects.tasks.delete_cancel_text') }}
                    </alex-custom-button>
                  </div>
                </Transition>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </Transition>

      <div class="tw-flex tw-w-full tw-justify-between align-center">
        <h5 class="text-h5 text-gray-800">Lista de Sprints</h5>
        <alex-custom-button prepend-icon="alex:Sprint" size="large" @click="createSprintDialog = true">
          {{ 'Nova Sprint' }}
        </alex-custom-button>
      </div>
      <Transition v-for="(sprint, i) in sprintBacklog" :key="`sprint-backlog-${i}`" name="slide">
        <v-expansion-panels
          v-if="sprintBacklog.length"
          v-model="expandSprints[i]"
          class="task-accordion my-6 rounded-lg"
        >
          <v-expansion-panel class="rounded-lg" value="panel">
            <v-expansion-panel-title disabled hide-actions class="tw-cursor-default">
              <v-icon
                :icon="expandSprints[i] === 0 ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                @click="expandSprints[i] = expandSprints[i] === 0 ? 1 : 0"
              />
              <span class="text-h5 text-gray-800"> {{ sprint.title }} </span>
              <span class="text-gray-600 text-body-1">
                {{ formattedDate(sprint.start_at) }} - {{ formattedDate(sprint.end_at) }}
              </span>
              <alex-custom-chip size="small" status="secondary" :text="`${sprint.tasks.length}`" />
              <!-- TODO: Habilitar os botões depois de adaptar as funções para funcionar dentro de sprints -->
              <!-- <div class="ml-auto d-flex ga-2">
                <alex-custom-dropdown icon="mdi-plus" variant="text" :items="editSprints()" />
                <alex-custom-dropdown icon="mdi-dots-vertical" variant="text" :items="editSprints()" />
              </div> -->
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <Transition mode="out-in" :name="getSlideTransition()">
                <div v-if="!sprint.tasks.length">
                  <alex-learningplan-task-empty-state
                    key="empty-state"
                    type="backlog"
                    :index="backlogIndex"
                    :drop-area="dragDrop.over.value.list === 'backlog'"
                    @drag-over="(index, event) => handleEmptyStateOver(index, event, sprint)"
                    @drag-leave="
                      (e) => {
                        dragDrop.onDragLeave(e);
                        hoveredSprint = null;
                      }
                    "
                  />
                </div>
                <div v-else>
                  <TaskTable
                    key="table"
                    :group="sprint.title"
                    :active-filter="isFilterActive"
                    :drag-from="dragDrop.dragFrom.value"
                    :dragging="dragDrop.dragging.value"
                    :is-project="true"
                    :is-editing-task="!!isEditingTask"
                    :over="setOver"
                    :search="search"
                    :sprints="sprintGroups"
                    :tasks="sprint.tasks"
                    @add-story="handleAddStory"
                    @add-task="(task) => handleAddTask(task, sprint.id)"
                    @create-item="createItem"
                    @edit-item="handleEdit"
                    @handle-blur="handleDelete"
                    @start-drag="
                      (id, e) => {
                        dragDrop.startDrag(id, e);
                      }
                    "
                    @drag-over="
                      (sprint, id, index, e) => {
                        const selectedSprint = sprintsValue.sprints.find(({ title }) => title === sprint);
                        hoveredSprint = selectedSprint ?? null;

                        dragDrop.onDragOver(sprint, id, index, e);
                      }
                    "
                    @drag-leave="
                      (e) => {
                        hoveredSprint = null;
                        dragDrop.onDragLeave(e);
                      }
                    "
                    @drop="(sprint) => {}"
                    @delete-task="handleDeleteTask"
                    @move-task="handleMoveTask"
                    @edit-task="(_id, task: SprintTask) => (editTask = task)"
                  />
                </div>
              </Transition>
              <div v-if="backlogIndex === 1" class="mb-4">
                <Transition mode="out-in" name="add-task">
                  <alex-custom-button
                    v-if="!showInputs[i + 1]"
                    class="w-100 create-task-btn"
                    prepend-icon="mdi-plus"
                    size="large"
                    variant="text"
                    :loading="isCreatingTaskRequest"
                    @click="showInputs[i + 1] = true"
                  >
                    {{ $t('pages.projects.tasks.add') }}
                  </alex-custom-button>
                  <div v-else class="d-flex ga-2">
                    <alex-inputs-text-field
                      v-model="tasksTitles[i + 1]"
                      autofocus
                      hide-details
                      class="w-100"
                      density="comfortable"
                      name="taskTitle"
                      :disabled="isCreatingTaskRequest"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask(i + 1, sprint.id)"
                      @keyup.esc="!showInputs[i + 1]"
                      @blur="handleInputBlur(i + 1)"
                    />
                    <alex-custom-button
                      size="large"
                      :loading="isCreatingTaskRequest"
                      @click="handleCreateTask(i + 1, sprint.id)"
                    >
                      {{ $t('pages.projects.tasks.add_task') }}
                    </alex-custom-button>
                    <alex-custom-button
                      size="large"
                      variant="tertiary"
                      :loading="isCreatingTaskRequest"
                      @click="handleInputCancel(i + 1)"
                    >
                      {{ $t('pages.projects.tasks.delete_cancel_text') }}
                    </alex-custom-button>
                  </div>
                </Transition>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </Transition>
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
      :task-id="editTask?.id || 0"
      :task="editTask"
      :sprints="sprintsValue.sprints"
      @update-value="
        (field, value) => {
          handleUpdateTask(editTask?.id ?? 0, field, value);
        }
      "
      @moved="updateTable"
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
