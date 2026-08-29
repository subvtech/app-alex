<script setup lang="ts">
import { avatar } from '@/components/alex/custom/AvatarGroup.vue';
import TreeView from '@/components/alex/custom/treeview/index.vue';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
// import { TaskStatus } from '~/models/simple/taskSimple.model';
import { SprintTask } from '../-types';
import { colors } from '@unovis/ts';

interface LocalSprintTask extends SprintTask {
  local?: boolean;
}

const newGroup = ref('');
const hoveredTree = ref<any | null>(null);

const { t } = useI18n();

type CreateItemPayload = {
  epic: number;
  id: number;
  local: boolean;
  organization: 'standard' | 'story' | 'epic';
  position: number;
  sprint: number;
  story: number;
  title: string;
};

type DeleteItemPayload = {
  title: string;
  id: number;
  hasChildren: boolean;
  organization: 'standard' | 'story' | 'epic';
  sprint_id?: number;
};

const emit = defineEmits<{
  'delete-task': [DeleteItemPayload];
  'drag-end': [any, string, DragEvent];
  'drag-leave': [DragEvent];
  'drag-over': [string, number, number, DragEvent];
  'edit-task': [number, SprintTask];
  'move-task': [];
  'start-drag': [number, DragEvent];
  'toggle-archive': [];
  'add-story': [number];
  'add-task': [SprintTask];
  'handle-blur': [SprintTask];
  'create-item': [CreateItemPayload];
  'edit-item': [SprintTask];
  'move-to-parent': [];
}>();

const props = withDefaults(
  defineProps<{
    activeFilter: boolean;
    dragFrom?: number;
    dragging?: boolean;
    group: string;
    isProject?: boolean;
    edit?: boolean;
    over?: { id: number; index?: number; list?: string; position?: 'top' | 'bottom' };
    search: string;
    sprints: string[];
    tasks: SprintTask[];
    editingTask?: SprintTask | null;
    draggedTask: any;
    hideLevels?: boolean;
  }>(),
  {
    dragFrom: -1,
    dragging: false,
    isProject: false,
    over: undefined,
    editingTask: null,
    draggedTask: null,
    edit: true,
    hideLevels: false,
  },
);

const getUsers = (task: SprintTask) => {
  if (!task?.task_members?.[0]) return [];
  return (task.task_members[0].learning_plan_group?.group_members.map((member) => ({
    name: member.student_member.user.fullname,
    image: {
      url: member.student_member.user?.avatar?.url,
      alt: member.student_member.user.fullname,
    },
  })) || []) as avatar[];
};

const typing = ref(false);
const tableSortBy = ref<{ key: string; order: string }[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref<LocalSprintTask | null>(null);

const isArchived = computed(() => props.group === 'archived');
const searchFilter = computed(() => props.search);
const transitionName = computed(() => (typing.value ? 'staggered-fade' : 'list'));
const draggedTaskSprintTitle = computed(() => {
  if (props.draggedTask) {
    return props.draggedTask?.sprint?.title ?? 'backlog';
  }

  return undefined;
});

const header = computed(() => {
  return [
    {
      title: t('pages.projects.tasks.header_title'),
      key: 'title',
      sortable: false,
      width: 716,
    },
    ...(props.hideLevels
      ? [
          {
            title: 'Épico',
            key: 'epic',
            sortable: false,
            width: 192,
          },

          {
            title: 'História',
            key: 'story',
            sortable: false,
            width: 192,
          },
        ]
      : []),
    {
      title: t('pages.projects.tasks.header_deadline_at'),
      key: 'deadline_at',
      sortable: false,
      width: 192,
    },
    {
      title: t('pages.projects.tasks.header_members'),
      key: 'students',
      sortable: false,
      width: 232,
    },

    ...(!props.hideLevels
      ? [
          {
            title: t('pages.projects.tasks.header_delivered'),
            key: 'delivered',
            sortable: false,
            width: 192,
          },
        ]
      : []),

    { title: '', key: 'actions', sortable: false, minWidth: '96px', width: 'auto' },
  ];
});

const isEditing = ref<LocalSprintTask | null>(null);

const removeTaskChildren = (acc: SprintTask[], curr: SprintTask) => {
  const currArray = [curr];

  if (curr.tasks) {
    currArray.push(...curr.tasks);
  }

  return [...acc, ...currArray];
};

const filterNoLevelTasks = (acc: SprintTask[], curr: SprintTask) => {
  const noRepeatedAcc = acc.filter((t) => t.id !== curr.id && !['epic', 'story'].includes(t.organization as string));
  return [...noRepeatedAcc, curr];
};

const tasksArray = computed(() => {
  const array = [...props.tasks];

  if (!props.hideLevels) return array;

  const noLevelsArray = array
    .reduce(removeTaskChildren, [])
    .reduce(removeTaskChildren, [])
    .reduce(filterNoLevelTasks, []);

  return noLevelsArray;
});

const scrollToNewTask = () => {
  const newTask = document.getElementById('localTask');
  if (newTask) {
    newTask.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const handleFieldEdit = () => {
  if (!isEditing.value) return;
  if (!isEditing.value.local) {
    if (newGroup.value !== '') {
      isEditing.value.title = newGroup.value;
      emit('edit-item', { ...isEditing.value, title: newGroup.value });
    }
  } else if (isEditing.value.local) {
    if (newGroup.value === '') {
      emit('handle-blur', isEditing.value);
    } else {
      isEditing.value.title = newGroup.value;
      emit('create-item', { ...isEditing.value } as unknown as CreateItemPayload);
    }
  }

  isEditing.value = null;
  newGroup.value = '';
};

const handleNullTree = () => {
  setTimeout(() => {
    hoveredTree.value = null;
  }, 100);
};

const deleteDialogText = computed(() => {
  return {
    title: t('pages.projects.tasks.delete_title', {
      item: taskToDelete.value?.title,
    }),
    subtitle: t(`pages.projects.tasks.delete_${taskToDelete.value?.organization}_subtitle`),
  };
});

const cancelDelete = () => {
  deleteModal.value = false;
  taskToDelete.value = null;
};

const confirmDelete = () => {
  emit('delete-task', {
    title: taskToDelete.value?.title || '',
    id: taskToDelete.value?.id || 0,
    sprint: taskToDelete.value?.sprint,
    hasChildren: !!taskToDelete.value?.tasks?.length,
    organization: taskToDelete.value?.organization || 'standard',
  } as DeleteItemPayload);
  cancelDelete();
};

const dropDownItems = (task: SprintTask): AlexDropdownItem[] => {
  const actions = {
    rename: getDropDownAction('rename', task.id, task),
    addStory: getDropDownAction('addStory', task.id, task),
    addTask: getDropDownAction('addTask', task.id, task),
    delete: getDropDownAction('delete', task.id, task),
    details: getDropDownAction('details', task.id, task),
  };

  switch (task.organization) {
    case 'epic':
      return [actions.rename, actions.addStory, actions.addTask, actions.delete].filter(
        (action): action is AlexDropdownItem => action !== undefined,
      );
    case 'story':
      return [actions.rename, actions.addTask, actions.delete].filter(
        (action): action is AlexDropdownItem => action !== undefined,
      );
    default:
      return [actions.details, props.edit ? actions.delete : undefined].filter(
        (action): action is AlexDropdownItem => action !== undefined,
      );
  }
};

const getDropDownAction = (action: string, id: number, task: SprintTask): AlexDropdownItem | undefined => {
  const actions: { [key: string]: AlexDropdownItem } = {
    delete: {
      text: t('pages.projects.tasks.dropdown_delete'),
      warning: true,
      onClick: () => {
        taskToDelete.value = task;
        deleteModal.value = true;
      },
    },
    details: {
      text: t('pages.projects.tasks.dropdown_details'),
      onClick: () => emit('edit-task', id, task),
    },
    rename: {
      text: t('pages.projects.tasks.dropdown_rename'),
      onClick: () => {
        isEditing.value = task;
        newGroup.value = task.title;
      },
    },
    addStory: {
      text: t('pages.projects.tasks.dropdown_add_story'),
      onClick: () => {
        emit('add-story', id);
      },
    },
    addTask: {
      text: t('pages.projects.tasks.dropdown_add_task'),
      onClick: () => {
        emit('add-task', task);
      },
    },
  };

  return actions[action];
};

const taskItemMargin = (level: number) => {
  return `margin-left: ${level * 20}px`;
};

watch(searchFilter, () => {
  typing.value = true;
  setTimeout(() => (typing.value = false), 1000);
});

watch(
  () => props.editingTask,
  (value) => {
    isEditing.value = value;
    setTimeout(() => {
      if (isEditing.value?.local) {
        scrollToNewTask();
      }
    }, 10);
  },
  { immediate: true },
);

const setDragStart = (id: number, e: DragEvent) => {
  // TODO: definir accepted groups
  setTimeout(() => {
    emit('start-drag', id, e);
  }, 0);
};
</script>

<template>
  <div>
    <v-data-table
      class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table mt-1"
      sort-asc-icon="mdi-arrow-up-thin"
      sort-desc-icon="mdi-arrow-down-thin"
      :class="
        over?.list === group && (draggedTaskSprintTitle !== group || hoveredTree?.organization === 'standard')
          ? 'table-drop'
          : ''
      "
      :headers="header"
      :items="tasksArray"
      :search="searchFilter"
      items-per-page="-1"
      @update:sort-by="(e) => (tableSortBy = e)"
      @dragleave="(e) => emit('drag-leave', e)"
    >
      <template #body="{ items, columns }">
        <transition-group :name="transitionName">
          <tr
            v-for="task in items"
            :key="task.id"
            class="text-5 text-no-wrap staggered-fade-item"
            @dragover.prevent="(e) => emit('drag-over', props.group, task.id, task.position, e)"
            @drop="
              (_) => {
                emit('drop', props.group);
              }
            "
          >
            <td class="pa-0" :colspan="columns.length">
              <TreeView
                :node-classes="`${
                  task.id === hoveredTree?.id &&
                  draggedTaskSprintTitle === over?.list &&
                  group === over?.list &&
                  'bg-gray-blue'
                } tw-bg-red-500 tw-transition px-4 text-gray-800 text-body-4 tw-border-b
                tw-border-[#e0e0e0] tw-h-[52px] d-flex align-center ga-1`"
                :custom-header="true"
                :custom-slot="true"
                :default-expand="true"
                :items="[task]"
                :selected-node="isEditing?.id"
                child-array-name="tasks"
                @dragenter.prevent="
                  () => {
                    hoveredTree = task;
                  }
                "
                @dragend="handleNullTree"
                @drop.prevent="
                  if ((props.draggedTask?.sprint?.title || 'backlog') === group) {
                    emit('move-to-parent', task);
                  } else {
                    emit('drop', props.group);
                  }
                  hoveredTree = null;
                "
              >
                <template #header="{ header }">
                  <div
                    v-if="isEditing?.id !== header.id"
                    class="d-flex w-100 justify-space-between align-center"
                    :class="
                      header.id === hoveredTree?.id &&
                      header.organization !== 'standard' &&
                      draggedTaskSprintTitle === over?.list &&
                      group === over?.list &&
                      'bg-gray-blue tw-transition'
                    "
                    @dragenter.stop="
                      (e) => {
                        hoveredTree = header;
                      }
                    "
                    @dragend="handleNullTree"
                    @drop.stop="
                      if ((props.draggedTask?.sprint?.title || 'backlog') === group) {
                        emit('move-to-parent', hoveredTree);
                      } else {
                        emit('drop', props.group);
                      }
                      hoveredTree = null;
                    "
                  >
                    <v-tooltip location="top">
                      <template #activator="{ props: tooltipProps }">
                        <span v-bind="tooltipProps" class="tree-title-ellipsis">{{ header.title }}</span>
                      </template>
                      {{ header.title }}
                    </v-tooltip>
                    <alex-custom-dropdown
                      prepend-icon="mdi-dots-vertical"
                      variant="text"
                      :items="dropDownItems(header)"
                    />
                  </div>
                  <v-text-field
                    v-else
                    id="localTask"
                    v-model="newGroup"
                    name="edit"
                    can-edit
                    class="w-100 text-gray-800 text-body-2 mb-2 editing-input"
                    density="compact"
                    variant="plain"
                    hide-details
                    maxlength="120"
                    autofocus
                    autocomplete="off"
                    @blur="handleFieldEdit"
                    @keydown.enter="handleFieldEdit"
                  ></v-text-field>
                </template>
                <template #default="{ item, level }">
                  <tr
                    v-if="isEditing?.id !== item.id"
                    :id="`${item.id}:${item.title}`"
                    :key="item.id"
                    class="d-flex align-center py-2 tasks-items text-gray-800 tw-select-none max-w-full"
                    :class="[
                      edit ? 'draggable-row' : '',
                      dragging && dragFrom == item.id ? 'dragging' : '',
                      item.parent_task ? 'border-bottom' : '',
                    ]"
                    :draggable="edit"
                    @dragstart="(e) => setDragStart(item.id, e)"
                    @dragend="
                      (e) => {
                        emit('drag-end', over?.list !== group ? item : null, level, e);
                      }
                    "
                  >
                    <td
                      class="text-body-4 text-overflow text-left task-title"
                      :class="`width-${175 - level * 4} min-w-${175 - level * 4}`"
                      :style="taskItemMargin(level)"
                      @dragover.prevent="(e) => emit('dragOver', props.group, task.id, task.position, e)"
                    >
                      <v-tooltip location="top">
                        <template #activator="{ props: tooltipProps }">
                          <span v-bind="tooltipProps" class="tree-title-ellipsis">{{ item.title }}</span>
                        </template>
                        {{ item.title }}
                      </v-tooltip>
                    </td>

                    <td v-if="hideLevels" class="min-w-48 field-cell field-outline">
                      <span
                        :class="
                          item.parent_task?.organization === 'epic' ||
                          item.parent_task?.parent_task?.organization === 'epic'
                            ? 'tree-title-ellipsis'
                            : 'tw-text-black/30'
                        "
                        >{{
                          item.parent_task?.organization === 'epic'
                            ? item.parent_task.title
                            : item.parent_task?.parent_task?.organization === 'epic'
                            ? item.parent_task.parent_task.title
                            : 'Sem épico'
                        }}
                      </span>
                    </td>

                    <td v-if="hideLevels" class="min-w-48 field-cell field-outline">
                      <span
                        :class="[
                          item.parent_task?.organization === 'story' ? 'tree-title-ellipsis' : 'tw-text-black/30',
                          'd-block',
                          'max-w-full',
                        ]"
                        >{{
                          item.parent_task?.organization === 'story' ? item.parent_task.title : 'Sem historia'
                        }}</span
                      >
                    </td>

                    <td class="min-w-48">
                      <alex-learningplan-task-date-chip
                        v-if="item.finish_at"
                        :date="item.finish_at"
                        :is-published="item.status === 'published' && !isArchived"
                      />
                      <span v-else class="tw-text-black/30">
                        {{ $t('pages.projects.tasks.not_informed') }}
                      </span>
                    </td>
                    <td class="min-w-58">
                      <div v-if="getUsers(item).length" class="ml-2" :class="{ 'gray-filter': isArchived }">
                        <alex-custom-avatar-group :avatar-items="getUsers(item) || []" :max="3" />
                      </div>
                      <span v-else>{{ $t('pages.projects.tasks.no_members') }}</span>
                    </td>
                    <td class="min-w-48" v-if="!hideLevels">
                      <alex-learningplan-task-submissions-status
                        v-if="item.delivered"
                        :submitted="item.delivered"
                        :type="item.type"
                      />
                      <div v-else>
                        <v-icon class="mr-1" icon="mdi-close-circle-outline "></v-icon>
                        <span>
                          {{ $t('pages.projects.tasks.no_submissions') }}
                        </span>
                      </div>
                    </td>
                    <td class="ml-auto tw-min-w-12">
                      <alex-custom-dropdown
                        variant="text"
                        prepend-icon="mdi-dots-vertical"
                        :items="dropDownItems(item)"
                      >
                        <template #activator="{ props: propsMenu }">
                          <v-tooltip location="bottom center" :text="t('pages.projects.tasks.tooltip_options')">
                            <template #activator="{ props: optionsTooltipProps }">
                              <alex-custom-button
                                v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                                color="gray-600"
                                icon="mdi-dots-vertical"
                                variant="text"
                              />
                            </template>
                          </v-tooltip>
                        </template>
                      </alex-custom-dropdown>
                    </td>
                  </tr>
                  <tr v-else class="tw-h-[52px] d-flex align-center">
                    <v-text-field
                      v-model="newGroup"
                      name="edit"
                      can-edit
                      class="w-100 text-gray-800 text-body-2 editing-input w-100 tw-ml-[60px]"
                      density="compact"
                      variant="plain"
                      hide-details
                      maxlength="120"
                      autofocus
                      autocomplete="off"
                      @blur="handleFieldEdit"
                      @keydown.enter="handleFieldEdit"
                    ></v-text-field>
                  </tr>
                </template>
              </TreeView>
            </td>
          </tr>
        </transition-group>
        <tr v-if="!items.length">
          <td class="text-center" :colspan="columns.length">
            {{ $t('pages.projects.tasks.no_tasks') }}
          </td>
        </tr>
      </template>
      <template #bottom />
    </v-data-table>
    <alex-custom-confirm-dialog
      v-model="deleteModal"
      no-input-confirmation
      variant="error"
      :cancel-button-text="t('pages.projects.tasks.delete_cancel_text')"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :submit-button-text="t('pages.projects.tasks.delete_confirm_text')"
      :subtitle="deleteDialogText.subtitle"
      :title="deleteDialogText.title"
      @cancel="cancelDelete"
      @submit="confirmDelete"
    />
  </div>
</template>

<style scoped>
.tree-title-ellipsis {
  display: block;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-cell {
  flex: 0 0 192px;
  width: 192px;
  min-width: 192px;
  max-width: 192px;
  overflow: hidden;
  padding: 0 8px;
}

.field-cell .tree-title-ellipsis {
  width: 100%;
  text-align: left;
}

.draggable-row {
  cursor: move;
  background-color: #fff;
  opacity: 0.99;
  user-select: none;
}

.table-drop {
  outline: 2px dashed rgb(var(--v-theme-gray-400)) !important;
  border-color: transparent !important;
}

.table {
  transition: border outline 0.3s ease;
}

:global(.table table) {
  position: relative !important;
  overflow: hidden !important;
}

.dragging {
  background-color: rgb(var(--v-theme-gray-blue)) !important;

  & td {
    opacity: 0 !important;
  }
}

.over {
  background-color: aliceblue;
}

.gray-filter {
  filter: grayscale(1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.staggered-fade-item {
  transition-timing-function: cubic-bezier(0.57, 0.06, 0, 1.06);
  transition-duration: 500ms;
  transition-property: opacity, transform;
}

.staggered-fade-enter,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.list-leave-active {
  position: absolute;
  width: 80%;
  opacity: 0;
}

.list-enter-from {
  opacity: 0;
}

.tasks-items td:has(:not(.task-title)) {
  padding: 0 16px;
}

.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
</style>

<style>
.editing-input {
  .v-field__input {
    font-family: Sen !important;
    font-size: 14px !important;
    font-style: normal !important;
    font-weight: 700 !important;
    line-height: 135% !important; /* 18.9px */
    letter-spacing: 0.28px !important;
  }
}
</style>
