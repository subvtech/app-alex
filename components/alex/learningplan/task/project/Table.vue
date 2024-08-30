<template>
  <v-data-table
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table"
    :items="tasksArray"
    :headers="header"
    :search="searchFilter"
    @update:sort-by="(e) => (tableSortBy = e)"
  >
    <template #body="{ items, columns }">
      <transition-group :name="transitionName">
        <tr
          v-for="task in items"
          :key="task.id"
          class="text-5 text-no-wrap staggered-fade-item"
        >
          <td :colspan="columns.length" class="pa-0">
            <alex-custom-treeview
              node-classes="px-4 text-gray-800 text-body-4 tw-border-b tw-border-gray-200 tw-h-[52px] d-flex align-center ga-1"
              :items="[task]"
              :custom-slot="true"
            >
              <template #default="{ item, level }">
                <tr class="d-flex align-center py-2">
                  <td class="text-body-4 text-overflow text-left mr-auto">
                    {{ item.title }}
                  </td>
                  <td class="mr-auto max-w-">
                    <alex-learningplan-task-date-chip
                      v-if="item.finish_at"
                      :date="item.finish_at"
                      :is-published="item.status === 'published' && !isArchived"
                    />
                    <span v-else>{{
                      $t('pages.task.table.placeholders.undefined')
                    }}</span>
                  </td>
                  <td class="mr-auto">
                    <div
                      v-if="item.students?.length"
                      class="ml-2"
                      :class="{ 'gray-filter': isArchived }"
                    >
                      <alex-custom-avatar-group
                        :avatar-items="item.students || []"
                        :max="3"
                      />
                    </div>
                    <span v-else>{{
                      $t('pages.task.table.placeholders.noMembers')
                    }}</span>
                  </td>
                  <td class="mr-auto">
                    <alex-learningplan-task-submissions-status
                      v-if="item.delivered"
                      :submitted="item.delivered"
                      :type="item.type"
                    />
                    <div v-else>
                      <v-icon
                        class="mr-1"
                        icon="mdi-close-circle-outline "
                      ></v-icon>
                      <span>{{
                        $t('pages.task.submissions.noSubmissions')
                      }}</span>
                    </div>
                  </td>
                  <td>
                    <alex-custom-dropdown
                      :items="dropDownItems(item)"
                      variant="text"
                      prepend-icon="mdi-dots-vertical"
                    >
                      <template #activator="{ props: propsMenu }">
                        <v-tooltip
                          :text="t('pages.task.table.tooltips.options')"
                          location="bottom center"
                        >
                          <template #activator="{ props: optionsTooltipProps }">
                            <alex-custom-button
                              variant="text"
                              color="gray-600"
                              v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                              icon="mdi-dots-vertical"
                            />
                          </template>
                        </v-tooltip>
                      </template>
                    </alex-custom-dropdown>
                  </td>
                </tr>
              </template>
            </alex-custom-treeview>
          </td>
        </tr>
      </transition-group>
      <tr v-if="!items.length">
        <td :colspan="columns.length" class="text-center">
          {{ $t('pages.task.table.placeholders.noTasks') }}
        </td>
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
  <alex-custom-confirm-dialog
    v-model="deleteModal"
    variant="error"
    :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
    :title="t('pages.task.deleteModal.title')"
    :subtitle="t('pages.task.deleteModal.subtitle')"
    :submit-button-text="t('pages.task.deleteModal.delete')"
    :cancel-button-text="t('pages.task.deleteModal.cancel')"
    no-input-confirmation
    @submit="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
import { TaskItem } from './List.vue';
import { TaskStatus } from '~/models/simple/taskSimple.model';

interface sortType {
  key: string;
  order: string;
}

const props = withDefaults(
  defineProps<{
    tasks: TaskItem[];
    sprints: string[];
    search: string;
    activeFilter: boolean;
    group: string;
    dragging?: boolean;
    over?: {
      id: number;
      index?: number;
      position?: 'top' | 'bottom';
      list?: string;
    };
    dragFrom?: number;
    isProject?: boolean;
  }>(),
  {
    isProject: false,
    dragFrom: -1,
    dragging: false,
    over: undefined,
  },
);

const { t } = useI18n();
const isArchived = computed(() => props.group === 'archived');
const typing = ref(false);

const searchFilter = computed(() => props.search);

watch(searchFilter, () => {
  typing.value = true;
  setTimeout(() => {
    typing.value = false;
  }, 1000);
});

const transitionName = computed(() => {
  return typing.value ? 'staggered-fade' : 'list';
});
const emit = defineEmits([
  'deleteTask',
  'moveTask',
  'toggleArchive',
  'dragOver',
  'dragEnd',
  'startDrag',
  'dragLeave',
  'editTask',
]);

const tableSortBy = ref<sortType[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref(-1);
const tasksArray = computed(() => {
  const array = [...props.tasks];
  const index = array.findIndex((task) => task.id === props.over?.id);
  const oldIndex = array.findIndex((task) => task.id === -1);
  if (
    oldIndex === props.over?.id ||
    tableSortBy.value.length ||
    props.activeFilter
  )
    return array;
  if (oldIndex !== -1) {
    array.splice(oldIndex, 1);
  }
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
    props.over?.position === 'top'
      ? array.splice(index, 0, item)
      : array.splice(index + 1, 0, item);
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

const dropDownItems = (task: TaskItem) => {
  const deliveredTotal = task.delivered
    ? task.delivered.underReview + task.delivered.completed
    : 0;

  const items = [getDropDownAction('details', task.id)];
  if (deliveredTotal === 0) {
    items.push(getDropDownAction('delete', task.id));
  }
  return items;
};

const getDropDownAction = (action: string, id: number) => {
  const dropdown = {
    delete: {
      text: t('pages.task.table.dropdown.delete'),
      warning: true,
      onClick: () => {
        taskToDelete.value = id;
        deleteModal.value = true;
      },
    },
    details: {
      text: t('pages.task.table.dropdown.details'),
      onClick: () => emit('editTask', id),
    },
  };

  return dropdown[action];
};

const header = [
  {
    title: t('pages.task.table.header.title'),
    key: 'title',
    sortable: true,
    // width: 680,
  },
  {
    title: t('pages.task.table.header.deadline_at'),
    key: 'deadline_at',
    // width: 140,
  },
  {
    title: t('pages.task.table.header.students'),
    key: 'students',
  },
  {
    title: t('pages.task.table.header.delivered'),
    key: 'delivered',
  },
  { title: '', key: 'actions', sortable: false },
];
</script>

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
</style>
