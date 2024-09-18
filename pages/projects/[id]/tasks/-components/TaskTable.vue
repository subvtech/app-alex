<script setup lang="ts">
import TreeView from '@/components/alex/custom/treeview/index.vue';
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';
import { TaskStatus } from '~/models/simple/taskSimple.model';
import { SprintTask } from '../-types';

interface LocalSprintTask extends SprintTask {
  local?: boolean;
}

const newGroup = ref('');
const hoveredTree = ref<any | null>(null);

const { t } = useI18n();

const header = [
  {
    title: t('pages.projects.tasks.header_title'),
    key: 'title',
    sortable: false,
    width: 356,
  },
  {
    title: t('pages.projects.tasks.header_deadline_at'),
    key: 'deadline_at',
    sortable: false,
    width: 192,
  },
  {
    title: t('pages.projects.tasks.header_students'),
    key: 'students',
    sortable: false,
    width: 192,
  },
  {
    title: t('pages.projects.tasks.header_delivered'),
    key: 'delivered',
    sortable: false,

    width: 192,
  },
  { title: '', key: 'actions', sortable: false },
];
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
type Emit = {
  'delete-task': [id: number];
  'drag-end': [item: any, level: string, event: DragEvent];
  'drag-leave': [event: DragEvent];
  'drag-over': [list: string, id: number, index: number, event: DragEvent];
  'edit-task': [id: number, task: SprintTask];
  'move-task': [];
  'start-drag': [id: number, event: DragEvent];
  'toggle-archive': [];
  'add-story': [id: number];
  'add-task': [task: SprintTask];
  'handle-blur': [task: SprintTask];
  'create-item': [task: CreateItemPayload];
  'edit-item': [task: SprintTask];
};

const emit = defineEmits([
  'deleteTask',
  'dragEnd',
  'dragLeave',
  'dragOver',
  'drop',
  'editTask',
  'moveTask',
  'startDrag',
  'toggleArchive',
  'addStory',
  'addTask',
  'handleBlur',
  'createItem',
  'editItem',
  'moveToParent',
]);

const props = withDefaults(
  defineProps<{
    activeFilter: boolean;
    dragFrom?: number;
    dragging?: boolean;
    group: string;
    isProject?: boolean;
    over?: { id: number; index?: number; list?: string; position?: 'top' | 'bottom' };
    search: string;
    sprints: string[];
    tasks: SprintTask[];
    editingTask?: SprintTask | null;
  }>(),
  {
    dragFrom: -1,
    dragging: false,
    isProject: false,
    over: undefined,
    editingTask: null,
  },
);

const typing = ref(false);
const tableSortBy = ref<{ key: string; order: string }[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref(-1);

const isArchived = computed(() => props.group === 'archived');
const searchFilter = computed(() => props.search);
const transitionName = computed(() => (typing.value ? 'staggered-fade' : 'list'));

const isEditing = ref<LocalSprintTask | null>(null);

const tasksArray = computed(() => {
  const array = [...props.tasks];
  // const index = array.findIndex((task) => task.id === props.over?.id);
  // const oldIndex = array.findIndex((task) => task.id === -1);

  // if (oldIndex === props.over?.id || tableSortBy.value.length || props.activeFilter) return array;
  // if (oldIndex !== -1) array.splice(oldIndex, 1);

  // const item = {
  //   id: -1,
  //   title: '',
  //   status: props.over?.list as TaskStatus,
  //   position: index,
  //   delivered: {
  //     toDo: 0,
  //     doing: 0,
  //     underReview: 0,
  //     completed: 0,
  //   },
  // };

  // if (index !== -1) {
  //   props.over?.position === 'top' ? array.splice(index, 0, item) : array.splice(index + 1, 0, item);
  // }

  return array;
});

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

const cancelDelete = () => {
  deleteModal.value = false;
  taskToDelete.value = -1;
};

const handleNullTree = () => {
  setTimeout(() => {
    hoveredTree.value = null;
  }, 100);
};

const confirmDelete = () => {
  emit('delete-task', taskToDelete.value);
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
      return [actions.details, actions.delete].filter((action): action is AlexDropdownItem => action !== undefined);
  }
};

const getDropDownAction = (action: string, id: number, task: SprintTask): AlexDropdownItem | undefined => {
  const actions: { [key: string]: AlexDropdownItem } = {
    delete: {
      text: t('pages.projects.tasks.dropdown_delete'),
      warning: true,
      onClick: () => {
        taskToDelete.value = id;
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
      :class="over?.list === group && group !== 'backlog' ? 'table-drop' : ''"
      :headers="header"
      :items="tasksArray"
      :search="searchFilter"
      @update:sort-by="(e) => (tableSortBy = e)"
      @dragleave="(e) => emit('dragLeave', e)"
    >
      <template #body="{ items, columns }">
        <transition-group :name="transitionName">
          <tr
            v-for="task in items"
            :key="task.id"
            class="text-5 text-no-wrap staggered-fade-item"
            @dragover.prevent="(e) => emit('dragOver', props.group, task.id, task.position, e)"
            @drop="(_) => emit('drop', props.group)"
          >
            <td class="pa-0" :colspan="columns.length">
              <TreeView
                leaf-classes="outline-bottom"
                :node-classes="`${
                  task.id === hoveredTree?.id && 'bg-gray-blue'
                } tw-bg-red-500 tw-transition px-4 text-gray-800 text-body-4 tw-border-b
                tw-border-[#e0e0e0] tw-h-[52px] d-flex align-center ga-1`"
                :custom-header="true"
                :custom-slot="true"
                :default-expand="true"
                :items="[task]"
                :selected-node="isEditing?.id"
                @dragenter.prevent="
                  () => {
                    hoveredTree = task;
                  }
                "
                @dragend="handleNullTree"
                @drop.prevent="
                  emit('moveToParent', task);
                  hoveredTree = null;
                "
              >
                <template #header="{ header }">
                  <div
                    v-if="isEditing?.id !== header.id"
                    class="d-flex w-100 justify-space-between align-center"
                    :class="header.id === hoveredTree?.id && 'bg-gray-blue tw-transition'"
                    @dragenter="
                      (e) => {
                        e.stopPropagation();
                        hoveredTree = header;
                      }
                    "
                    @dragend="handleNullTree"
                    @drop.prevent="
                      emit('moveToParent', header);
                      hoveredTree = null;
                    "
                  >
                    <p>{{ header.title }}</p>
                    <alex-custom-dropdown
                      prepend-icon="mdi-dots-vertical"
                      variant="text"
                      :items="dropDownItems(header)"
                    />
                  </div>
                  <v-text-field
                    v-else
                    v-model="newGroup"
                    name="edit"
                    can-edit
                    class="w-100 text-gray-800 text-body-2 mb-2 editing-input"
                    density="compact"
                    variant="plain"
                    hide-details
                    maxlength="64"
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
                    class="tw-bg-red-500 d-flex align-center py-2 tasks-items outline-bottom text-gray-800"
                    :class="[
                      dragging && dragFrom == item.id ? 'dragging' : '',
                      group === 'backlog' ? 'draggable-row' : '',
                    ]"
                    :draggable="group === 'backlog'"
                    @dragstart="(e) => setDragStart(item.id, e)"
                    @dragend="(e) => emit('drag-end', item, level, e)"
                  >
                    <td
                      class="text-body-4 text-overflow text-left task-title"
                      :class="`width-${85 - level * 4}`"
                      :style="taskItemMargin(level)"
                      @dragover.prevent="(e) => emit('dragOver', props.group, task.id, task.position, e)"
                    >
                      {{ item.title }}
                    </td>

                    <td class="width-40">
                      <alex-learningplan-task-date-chip
                        v-if="item.finish_at"
                        :date="item.finish_at"
                        :is-published="item.status === 'published' && !isArchived"
                      />
                      <span v-else class="tw-text-black/30">
                        {{ $t('pages.projects.tasks.not_informed') }}
                      </span>
                    </td>
                    <td class="width-40">
                      <div v-if="item.students?.length" class="ml-2" :class="{ 'gray-filter': isArchived }">
                        <alex-custom-avatar-group :avatar-items="item.students || []" :max="3" />
                      </div>
                      <span v-else>{{ $t('pages.projects.tasks.no_members') }}</span>
                    </td>
                    <td class="width-40">
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
                    <td class="ml-auto">
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
                      maxlength="64"
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
      :subtitle="t('pages.projects.tasks.delete_subtitle')"
      :title="t('pages.projects.tasks.delete_title')"
      @cancel="cancelDelete"
      @submit="confirmDelete"
    />
  </div>
</template>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  margin: 0 16px;
}

.outline-bottom {
  outline: none;
  position: relative;
}

.outline-bottom::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
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
