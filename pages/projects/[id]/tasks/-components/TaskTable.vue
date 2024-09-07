<script setup lang="ts">
import TreeView from '@/components/alex/custom/treeview/index.vue';
import { TaskStatus } from '@/models/simple/taskSimple.model';
import { SprintTask } from '../-types';

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

const emit = defineEmits([
  'deleteTask',
  'dragEnd',
  'dragLeave',
  'dragOver',
  'editTask',
  'moveTask',
  'startDrag',
  'toggleArchive',
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
  }>(),
  {
    dragFrom: -1,
    dragging: false,
    isProject: false,
    over: undefined,
  },
);

const typing = ref(false);
const tableSortBy = ref<{ key: string; order: string }[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref(-1);

const isArchived = computed(() => props.group === 'archived');
const searchFilter = computed(() => props.search);
const transitionName = computed(() => (typing.value ? 'staggered-fade' : 'list'));

const tasksArray = computed(() => {
  const array = [...props.tasks];
  const index = array.findIndex((task) => task.id === props.over?.id);
  const oldIndex = array.findIndex((task) => task.id === -1);

  if (oldIndex === props.over?.id || tableSortBy.value.length || props.activeFilter) return array;
  if (oldIndex !== -1) array.splice(oldIndex, 1);

  const item = {
    id: -1,
    title: '',
    status: props.over?.list as TaskStatus,
    position: index,
    delivered: {
      toDo: 0,
      doing: 0,
      underReview: 0,
      completed: 0,
    },
  };

  if (index !== -1) {
    props.over?.position === 'top' ? array.splice(index, 0, item) : array.splice(index + 1, 0, item);
  }

  return array;
});

const cancelDelete = () => {
  deleteModal.value = false;
  taskToDelete.value = -1;
};

const confirmDelete = () => {
  emit('deleteTask', taskToDelete.value);
  cancelDelete();
};

const dropDownItems = (task: SprintTask) => {
  const total = task.delivered ? task.delivered.underReview + task.delivered.completed : 0;
  const items = [getDropDownAction('details', task.id, task)];
  return total ? items : items.concat(getDropDownAction('delete', task.id, task));
};

const getDropDownAction = (action: string, id: number, task: SprintTask) => {
  return {
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
      onClick: () => emit('editTask', id, task),
    },
  }[action];
};

const taskItemMargin = (level: number) => {
  return `margin-left: ${level * 20}px`;
};

watch(searchFilter, () => {
  typing.value = true;
  setTimeout(() => (typing.value = false), 1000);
});
</script>

<template>
  <div>
    <v-data-table
      class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table"
      sort-asc-icon="mdi-arrow-up-thin"
      sort-desc-icon="mdi-arrow-down-thin"
      :headers="header"
      :items="tasksArray"
      :search="searchFilter"
      @update:sort-by="(e) => (tableSortBy = e)"
    >
      <template #body="{ items, columns }">
        <transition-group :name="transitionName">
          <tr v-for="task in items" :key="task.id" class="text-5 text-no-wrap staggered-fade-item">
            <td class="pa-0" :colspan="columns.length">
              <TreeView
                leaf-classes="outline-bottom"
                node-classes="px-4 text-gray-800 text-body-4 tw-border-b tw-border-[#e0e0e0] tw-h-[52px] d-flex align-center ga-1"
                :custom-header="true"
                :custom-slot="true"
                :default-expand="true"
                :items="[task]"
              >
                <template #header="{ header }">
                  <div class="d-flex w-100 justify-space-between align-center">
                    <p>{{ header.name }}</p>
                    <alex-custom-dropdown
                      prepend-icon="mdi-dots-vertical"
                      variant="text"
                      :items="dropDownItems(header)"
                    />
                  </div>
                </template>
                <template #default="{ item, level }">
                  <tr class="d-flex align-center py-2 tasks-items outline-bottom">
                    <td
                      class="text-body-4 text-overflow text-left task-title"
                      :class="`width-${85 - level * 4}`"
                      :style="taskItemMargin(level)"
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
  border: 1.5px dashed rgb(var(--v-theme-gray-400)) !important;
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
