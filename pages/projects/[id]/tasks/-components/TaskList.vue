<script setup lang="ts">
import { useMultipleDragDrop } from '@/composables/useMultipleDragDrop';
import { ApplicationError } from '@/models/simple/applicationError.model';
import { TaskSimple } from '@/models/simple/taskSimple.model';
import { filterType } from '@/pages/courses/[id]/tasks/index.vue';
import { isEmpty } from '@/utils/is-empty';
import { useQueryClient } from '@tanstack/vue-query';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
import { useCreateTask, useDeleteTask, useUpdateTask, useUpdateTaskStatus } from '../-composables/useCreateTask';
import { SprintsResponse, useDeleteSprint, useGetSprints, useMoveSprint } from '../-composables/useSprints';
import { Droppable, SprintTask } from '../-types';
import DrawerTaskDetails from './DrawerTaskDetails.vue';
import TaskSprint, { Sprint } from './TaskSprint.vue';
import TaskTable from './TaskTable.vue';

interface DropdownItem {
  text: string;
  warning?: boolean;
  onClick: () => void;
}

const props = defineProps<{
  filter?: filterType;
  search: string;
}>();

const i18dir = 'pages.projects.tasks.actions';

const { t } = useI18n();
const i18n = useI18n();

const { setMessage } = useMessageStore();
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const learningPlanStore = useLearningPlanStore();
const { update } = useStrapi();
const dragDrop = useMultipleDragDrop();

// Drag and drop
const hoveredSprint = ref<any | null>(0);
const hoveredTask = ref<any | null>(null);
const draggedTask = ref<any | null>(null);

// watch(hoveredSprint, (val) => console.log('Hovered sprint', val));

// Querys
const queryClient = useQueryClient();
const { data: sprintsValue, refetch: refetchSprints } = useGetSprints(learninplanId);
const { mutateAsync: createTask, isPending: isCreatingTaskRequest } = useCreateTask(
  learninplanId,
  queryClient,
  setMessage,
  t,
);
const { mutateAsync: deleteTask } = useDeleteTask(learninplanId, queryClient, setMessage, t);
const { mutateAsync: updateTask } = useUpdateTask();
const { mutateAsync: updateStatusTask } = useUpdateTaskStatus();
const { mutateAsync: deleteSprint, isPending: deletingTask } = useDeleteSprint(
  learninplanId,
  queryClient,
  setMessage,
  t,
);
const { mutateAsync: moveSprint } = useMoveSprint(learninplanId, queryClient, setMessage, t);
const sprints = ref<Droppable<Sprint>[]>([]);

// refs
const isCreatingTask = ref(false);
const taskTitle = ref('');
const createTaskSprintId = ref<number>();
const editTask = ref<SprintTask>();
const editingTask = ref<null | SprintTask>(null);
const backlogIndex = 1;
const taskSections = [t('pages.projects.tasks.backlog')];
const expandBacklog = ref(0);
const expandSprints = ref<number[]>([]);
const showInputs = ref<boolean[]>([false]);
const tasksTitles = ref<string[]>([]);
const createSprintDialog = ref(false);
const createdIndex = ref<number>();
const editableSprint = ref<Sprint | null>();
const deleteModal = ref(false);
const sprintToDelete = ref<Sprint | null>(null);

const isLoading = computed(() => {
  return (index) => {
    return isCreatingTaskRequest.value && createdIndex.value === index;
  };
});

const addToSprint = () => {
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

const editSprint = (sprint: Sprint, index: number): DropdownItem[] => {
  const items: DropdownItem[] = [];

  const moveActions = [
    {
      condition: true,
      text: t('pages.projects.sprints.edit'),
      action: () => {
        editableSprint.value = sprint;
        createSprintDialog.value = true;
      },
    },
    {
      condition: index !== 0,
      text: t('pages.projects.sprints.move_up'),
      action: () =>
        moveSprint({
          sprints: sprintBacklog.value,
          editingSprint: {
            id: sprint.id,
            move: 'up',
          },
        }),
    },
    {
      condition: index !== sprints.value.length - 1,
      text: t('pages.projects.sprints.move_down'),
      action: () =>
        moveSprint({
          sprints: sprintBacklog.value,
          editingSprint: {
            id: sprint.id,
            move: 'down',
          },
        }),
    },
    {
      condition: true,
      text: t('pages.projects.sprints.delete'),
      warning: true,
      action: () => {
        sprintToDelete.value = sprint;
        deleteModal.value = true;
      },
    },
  ];

  moveActions.forEach(({ condition, text, action, warning }) => {
    if (condition) {
      items.push({
        text,
        warning,
        onClick: action,
      });
    }
  });

  return items;
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

  return sprintsValue.value.sprints
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((sprint) => ({
      ...sprint,
      tasks: sprint.tasks.map(formatTasks),
    }));
});

const checkForCompletedTasks = (sprint: Sprint) => {
  return sprint.tasks.some((task) => task.kanban_column_task?.kanban_column.status_type === 'done');
};

const deleteDialogText = computed(() => {
  if (sprintBacklog.value.length === 1) {
    return {
      title: t('pages.projects.sprints.delete_modal.title_unique', { sprint: sprintToDelete.value?.title }),
      subtitle: t('pages.projects.sprints.delete_modal.subtitle_unique'),
      disableDelete: true,
    };
  }
  if (sprintToDelete.value && checkForCompletedTasks(sprintToDelete.value)) {
    return {
      title: t('pages.projects.sprints.delete_modal.title_completed_tasks', { sprint: sprintToDelete.value?.title }),
      subtitle: t('pages.projects.sprints.delete_modal.subtitle_completed_tasks'),
      disableDelete: true,
    };
  }
  return {
    title: t('pages.projects.sprints.delete_modal.title_confirm', { sprint: sprintToDelete.value?.title }),
    subtitle: t('pages.projects.sprints.delete_modal.subtitle_confirm'),
    disableDelete: false,
  };
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
  editingTask.value = newTask;
};

// Otimizar isso
const findTaskById = (id) => {
  if (!id) {
    return null;
  }

  id = Number(id);

  let foundTask;

  sprintsValue.value.backlog.forEach((task) => {
    if (task.id === id) {
      foundTask = task;
    }

    task.tasks?.forEach((subTask) => {
      if (subTask.id === id) {
        foundTask = subTask;
      }

      subTask.tasks?.forEach((subSubTask) => {
        if (subSubTask.id === id) {
          foundTask = subSubTask;
        }
      });
    });
  });

  if (foundTask) {
    return foundTask;
  }

  sprintsValue.value.sprints?.forEach((sprint) => {
    sprint.tasks?.forEach((task) => {
      if (task.id === id) {
        foundTask = task;
      }

      task.tasks?.forEach((subTask) => {
        if (subTask.id === id) {
          foundTask = subTask;
        }

        subTask.tasks?.forEach((subSubTask) => {
          if (subSubTask.id === id) {
            foundTask = subSubTask;
          }
        });
      });
    });
  });

  return foundTask ?? null;
};

const handleAddTask = (task?: SprintTask, sprintId?: number) => {
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
      return {
        ...data,
        backlog: newTasks,
      };
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
  editingTask.value = newTask;
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
  editingTask.value = newTask;
};

const getSlideTransition = () => {
  return sprintsValue.value.backlog.length ? 'slide-down' : 'slide-up';
};

const handleCreateTask = async (index: number, sprint?: SprintSimple) => {
  if (tasksTitles.value[index] && learningPlanStore.learningPlan && learningPlanStore.learningPlan.id) {
    createdIndex.value = index;
    const learningPlanId = learningPlanStore.learningPlan.id;
    const higherIndex = getHigherIndex();
    await createTask({
      title: tasksTitles.value[index],
      learningPlanId,
      position: higherIndex,
      organization: 'standard',
      sprint,
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

const handleBlur = () => {
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

const handleDeleteTask = async (task: {
  title: string;
  id: number;
  sprintId: number;
  hasChildren: boolean;
  organization: 'standard' | 'story' | 'epic';
}) => {
  await deleteTask(task);
  await refetchSprints();
};

const createItem = async (task: {
  epic: number;
  id: number;
  local: boolean;
  organization: 'standard' | 'story' | 'epic';
  position: number;
  sprint: SprintSimple;
  story: number;
  title: string;
}) => {
  await createTask({
    title: task.title,
    learningPlanId: learninplanId.value,
    organization: task.organization || 'standard',
    position: task.position,
    parentTask: task.story ? task.story : task.epic,
    sprint: task.sprint,
  });
  queryClient.invalidateQueries({ queryKey: ['groupings', learninplanId] });
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

// const handleEmptyStateLeave = () => {
//   setTimeout(() => {
//     console.log('Nulando hovered sprint');
//     hoveredSprint.value = null;
//   }, 300);
// };

const handleMoveToParent = (parentTask) => {
  const remove = parentTask.organization === 'standard' && !parentTask.parent_task && draggedTask.value.parent_task;

  if (!draggedTask.value || !parentTask || (parentTask.organization === 'standard' && !remove)) {
    return;
  }

  if (parentTask?.tasks?.some((task) => Number(task.id) === Number(draggedTask.value.id))) {
    return;
  }

  update('tasks', draggedTask.value.id, {
    parent_task: remove ? null : parentTask.id,
  })
    .then(() => {
      setMessage(
        remove ? t(`${i18dir}.parent_removed`) : t(`${i18dir}.moved`, { item: parentTask.title }),
        'success',
        true,
      );
      refetchSprints();
    })
    .catch(() => setMessage(t(`${i18dir}.moved_fail`), 'error', true));
};

const handleMoveTask = async ({ id, status }: { id: number; status: TaskStatus }) => {
  try {
    const task = sprintsValue.value.backlog.find((t) => t.id === 0);
    if (task) {
      // const position = getHigherIndex();
      // await updateTask({ id, status, position });
      await refetchSprints();
      showSuccessMessage('moveSuccess');
    }
  } catch (err: any) {
    showErrorMessage('moveError', err);
  }
};

const handleDeleteSprint = async (sprintId?: number) => {
  if (!sprintId) return;
  await deleteSprint(sprintId);
  deleteModal.value = false;
};

// OnDrop
const onDrop = (item, __, e) => {
  if (!hoveredSprint.value) {
    hoveredSprint.value = sprintsValue.value.sprints.find(({ title }) => title === item?.title) ?? null;
  }

  if (draggedTask.value?.kanban_column_task?.kanban_column?.status_type === 'done' && !hoveredSprint.value?.id) {
    setMessage(t(`${i18dir}.already_done`), 'warning', true);
    hoveredSprint.value = null; // So sprint is not updated
  }

  if (!hoveredSprint.value || !item?.id) {
    hoveredSprint.value = null;
    dragDrop.dragEnd();
    return;
  }

  updateStatusTask({ id: item.id, sprint: hoveredSprint.value.id });
  update('tasks', Number(item.id), {
    sprint: hoveredSprint.value?.id ?? null,
  })
    .then(() => {
      setMessage(t(`${i18dir}.moved`, { item: hoveredSprint.value.title }), 'success', true);
      refetchSprints();
    })
    .finally(() => {
      hoveredSprint.value = null;
    });

  dragDrop.dragEnd();
};

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

const updateSprints = () => {
  queryClient.invalidateQueries({ queryKey: ['sprints', learninplanId] });
};

const updateTaskContract = (newAddress: string | null) => {
  console.log(editTask.value);
  if (!editTask.value) return;
  editTask.value = { ...editTask.value, contract_address: newAddress };
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
                <alex-custom-dropdown icon="mdi-plus" variant="text" :items="addToSprint()" />
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
                    :editing-task="editingTask"
                    :over="setOver"
                    :search="search"
                    :sprints="sprintGroups"
                    :tasks="backlogTasks"
                    :dragged-task="draggedTask"
                    @add-story="handleAddStory"
                    @add-task="handleAddTask"
                    @create-item="createItem"
                    @edit-item="handleEdit"
                    @handle-blur="handleBlur"
                    @start-drag="
                      (idVal, e, dropTo, dragGhost) => {
                        dragDrop.startDrag(idVal, e, dropTo, dragGhost);

                        const data = e?.target?.attributes?.id?.value;

                        if (!data) {
                          return;
                        }

                        const [id, title] = data.split(':');
                        draggedTask = findTaskById(id);
                      }
                    "
                    @drag-over="
                      (sprint, idVal, index, e) => {
                        hoveredSprint = { title: 'backlog' };
                        dragDrop.onDragOver(sprint, idVal, index, e);

                        const data = e?.target?.attributes?.id?.value;

                        if (!data) {
                          return;
                        }

                        const [id, title] = data.split(':');

                        hoveredTask = { id, title };
                      }
                    "
                    @drag-leave="
                      (e) => {
                        dragDrop.onDragLeave(e);
                        hoveredSprint = null;
                      }
                    "
                    @drag-end="
                      (item, __, e) => {
                        onDrop(item, __, e);
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
                    :loading="isLoading(0)"
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
                      :loading="isLoading(0)"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask(0)"
                      @keyup.esc="!showInputs[0]"
                      @blur="handleInputBlur(0)"
                    />
                    <alex-custom-button size="large" :loading="isLoading(0)" @click="handleCreateTask(0)">
                      {{ $t('pages.projects.tasks.add_task') }}
                    </alex-custom-button>
                    <alex-custom-button
                      size="large"
                      variant="tertiary"
                      :loading="isLoading(0)"
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
        <alex-custom-button
          prepend-icon="alex:Sprint"
          size="large"
          @click="
            () => {
              createSprintDialog = true;
              editableSprint = null;
            }
          "
        >
          {{ t('pages.projects.sprints.new_sprint') }}
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
              <div class="ml-auto d-flex ga-2">
                <alex-custom-dropdown icon="mdi-dots-vertical" variant="text" :items="editSprint(sprint, i)" />
              </div>
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
                    @drag-leave="dragDrop.onDragLeave"
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
                    :editing-task="editingTask"
                    :over="setOver"
                    :search="search"
                    :sprints="sprintGroups"
                    :tasks="sprint.tasks"
                    :dragged-task="draggedTask"
                    @add-story="handleAddStory"
                    @add-task="(task) => handleAddTask(task, sprint.id)"
                    @create-item="createItem"
                    @edit-item="handleEdit"
                    @handle-blur="handleBlur"
                    @start-drag="
                      (idVal, e, dropTo, dragGhost) => {
                        dragDrop.startDrag(idVal, e, dropTo, dragGhost);

                        const data = e?.target?.attributes?.id?.value;

                        if (!data) {
                          return;
                        }

                        const [id, title] = data.split(':');
                        draggedTask = findTaskById(id);
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
                    @drag-end="
                      (item, __, e) => {
                        onDrop(item, __, e);
                        draggedTask = null;
                      }
                    "
                    @drop="(sprint) => {}"
                    @delete-task="(index) => handleDeleteTask(index, i)"
                    @move-task="handleMoveTask"
                    @move-to-parent="handleMoveToParent"
                    @edit-task="(_id, task) => (editTask = task)"
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
                    :loading="isLoading(i + 1)"
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
                      :disabled="isLoading(i + 1)"
                      :placeholder="t('pages.projects.tasks.add_placeholder')"
                      @keyup.enter="handleCreateTask(i + 1, sprint)"
                      @keyup.esc="!showInputs[i + 1]"
                      @blur="handleInputBlur(i + 1)"
                    />
                    <alex-custom-button
                      size="large"
                      :loading="isLoading(i + 1)"
                      @click="handleCreateTask(i + 1, sprint)"
                    >
                      {{ $t('pages.projects.tasks.add_task') }}
                    </alex-custom-button>
                    <alex-custom-button
                      size="large"
                      variant="tertiary"
                      :loading="isLoading(i + 1)"
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
        :edit-sprints="addToSprint"
        :learning-plan-id="learningPlanStore.learningPlan.id"
        :search="search"
      />
      <alex-project-dialogs-sprint
        v-model="createSprintDialog"
        :sprint-data="editableSprint"
        :project-end-date="learningPlanStore.learningPlan.end_date"
        :project-start-date="learningPlanStore.learningPlan.start_date"
        :project-id="learningPlanStore.learningPlan.id"
        :sprints-length="sprintsValue.sprints.length"
        @create="updateSprints"
        @update="updateSprints"
      />
      <alex-custom-confirm-dialog
        v-model="deleteModal"
        no-input-confirmation
        variant="error"
        :cancel-button-text="t('pages.projects.tasks.delete_cancel_text')"
        :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
        :submit-button-text="t('pages.projects.tasks.delete_confirm_text')"
        :subtitle="deleteDialogText.subtitle"
        :title="deleteDialogText.title"
        :disable-submit-button="deleteDialogText.disableDelete"
        :loading="deletingTask"
        @cancel="deleteModal = false"
        @submit="handleDeleteSprint(sprintToDelete?.id)"
      />
    </div>

    <DrawerTaskDetails
      v-model="teacherDrawer"
      :task="editTask"
      :sprints="sprintsValue.sprints"
      :contract-address="editTask?.contract_address"
      @update-value="
        (field) => {
          handleUpdateTask(editTask?.id ?? 0, field);
        }
      "
      @update:contract="updateTaskContract"
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
