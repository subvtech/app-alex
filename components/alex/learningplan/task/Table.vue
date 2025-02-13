<template>
  <v-data-table
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table"
    :class="over.list === group && (tableSortBy.length || activeFilter) ? 'table-drop' : ''"
    items-per-page="-1"
    :items="tasksArray"
    :headers="header"
    :search="searchFilter"
    @update:sort-by="(e) => (tableSortBy = e)"
    @dragleave="(e) => emit('dragLeave', e)"
  >
    <template #body="{ items, columns }">
      <transition-group :name="transitionName">
        <tr
          v-for="item in items"
          :key="item.id"
          :draggable="isTaskMovable(item)"
          class="text-5 text-no-wrap staggered-fade-item bg-white"
          :class="[
            isArchived ? 'text-gray-400' : 'text-gray-600',
            dragging && dragFrom == item.id ? 'dragging' : '',
            isTaskMovable(item) ? 'draggable-row' : '',
          ]"
          @dragend="emit('dragEnd', item, tableSortBy[0]?.key)"
          @dragstart="(e) => setDragStart(item, e)"
          @dragover.prevent="(e) => setDragOver(item.id, item.position, e)"
        >
          <template v-if="!previewRow(item.id)">
            <td class="text-body-4 text-overflow text-left" :class="isArchived ? 'text-gray-400' : 'text-gray-800'">
              {{ item.title }}
            </td>
            <td>
              <alex-learningplan-task-date-chip
                v-if="item.finish_at"
                :date="item.finish_at"
                :is-published="item.status === 'published' && !isArchived"
              />
              <span v-else>{{ $t('pages.task.table.placeholders.undefined') }}</span>
            </td>
            <td v-if="!individualJourney">
              <div v-if="item.type">
                <v-icon
                  class="mr-1"
                  :icon="item.type === 'group' ? 'mdi-account-multiple-outline' : 'mdi-account-outline'"
                />
                <span>{{
                  item.type === 'group' ? $t('pages.task.table.type.group') : $t('pages.task.table.type.individual')
                }}</span>
              </div>
              <span v-else>{{ $t('pages.task.table.placeholders.undefined') }}</span>
            </td>
            <td v-if="!individualJourney">
              <div v-if="item.students?.length" class="ml-2" :class="{ 'gray-filter': isArchived }">
                <alex-custom-avatar-group :avatar-items="item.students || []" :max="3" />
              </div>
              <span v-else>{{ $t('pages.task.table.placeholders.noMembers') }}</span>
            </td>
            <td>
              <alex-learningplan-task-submissions-status
                v-if="item.delivered"
                :submitted="item.delivered"
                :type="item.type"
              />
              <div v-else>
                <v-icon class="mr-1" icon="mdi-close-circle-outline "></v-icon>
                <span>{{ $t('pages.task.submissions.noSubmissions') }}</span>
              </div>
            </td>
            <td>
              <v-tooltip :text="t('pages.task.table.tooltips.kanban')" location="bottom center">
                <template #activator="{ props: tooltipKanban }">
                  <alex-custom-button
                    v-bind="tooltipKanban"
                    icon="alex:Kanban"
                    variant="text"
                    color="gray-600"
                    @click="
                      () => {
                        if (props.individualJourney) {
                          emit('kanban');
                        } else {
                          navigateTo(`tasks/${item.id}`);
                        }
                      }
                    "
                  />
                </template>
              </v-tooltip>
              <alex-custom-dropdown :items="dropDownItems(item)" variant="text" prepend-icon="mdi-dots-vertical">
                <template #activator="{ props: propsMenu }">
                  <v-tooltip :text="t('pages.task.table.tooltips.options')" location="bottom center">
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
          </template>
          <td v-else :colspan="columns.length" class="row-drop"></td>
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
import { TaskStatus } from '~/models/simple/taskSimple.model';
import { TaskItem } from './Container.vue';

interface sortType {
  key: string;
  order: string;
}

const props = defineProps<{
  tasks: TaskItem[];
  search: string;
  activeFilter: boolean;
  group: string;
  dragging: boolean;
  isGuest?: boolean;
  over: {
    id: number;
    index?: number;
    position?: 'top' | 'bottom';
    list?: string;
  };
  dragFrom: number;
  individualJourney?: boolean;
}>();

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
  if (props.dragging) return 'dnd-list';
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
  'kanban',
]);

const tableSortBy = ref<sortType[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref(-1);
const tasksArray = computed(() => {
  const array = [...props.tasks];
  const index = array.findIndex((task) => task.id === props.over.id);
  const oldIndex = array.findIndex((task) => task.id === -1);
  if (oldIndex === props.over.id || tableSortBy.value.length || props.activeFilter) return array;
  if (oldIndex !== -1) {
    array.splice(oldIndex, 1);
  }
  const item = {
    id: -1,
    title: '',
    status: props.over.list as TaskStatus,
    position: index,
    delivered: {
      toDo: 0,
      doing: 0,
      underReview: 0,
      completed: 0,
    },
  };
  if (index !== -1) {
    props.over.position === 'top' ? array.splice(index, 0, item) : array.splice(index + 1, 0, item);
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
  const deliveredTotal = task.delivered ? task.delivered.underReview + task.delivered.completed : 0;
  const items = [getDropDownAction('details', task.id), getDropDownAction('kanban', task.id)];

  if (props.isGuest) {
    return items;
  }

  if (props.individualJourney) {
    items.push(getDropDownAction('delete', task.id));
    return items;
  }

  switch (task.status) {
    case 'draft':
      if (isTaskMovable(task)) {
        items.push(getDropDownAction('publish', task.id));
        items.push(getDropDownAction('close', task.id));
      }
      items.push(getDropDownAction('delete', task.id));
      break;
    case 'published':
      if (deliveredTotal === 0) {
        items.push(getDropDownAction('draft', task.id));
        items.push(getDropDownAction('close', task.id));
        items.push(getDropDownAction('delete', task.id));
      } else if (task.archived_at) {
        items.push(getDropDownAction('unarchive', task.id));
      } else {
        items.push(getDropDownAction('close', task.id));
        items.push(getDropDownAction('archive', task.id));
      }
      break;
    case 'finished':
      if (deliveredTotal === 0) {
        items.push(getDropDownAction('draft', task.id));
        items.push(getDropDownAction('publish', task.id));
        items.push(getDropDownAction('delete', task.id));
      } else if (task.archived_at) {
        items.push(getDropDownAction('unarchive', task.id));
      } else {
        items.push(getDropDownAction('publish', task.id));
        items.push(getDropDownAction('archive', task.id));
      }
      break;
    default:
      break;
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
    publish: {
      text: t('pages.task.table.dropdown.publish'),
      onClick: () =>
        emit('moveTask', {
          id,
          status: 'published',
        }),
    },
    details: {
      text: t('pages.task.table.dropdown.details'),
      onClick: () => emit('editTask', id),
    },
    kanban: {
      text: t('pages.task.table.dropdown.kanban'),
      onClick: () => {
        if (props.individualJourney) {
          emit('kanban');
        } else {
          navigateTo(`tasks/${id}`);
        }
      },
    },
    draft: {
      text: t('pages.task.table.dropdown.draft'),
      onClick: () => emit('moveTask', { id, status: 'draft' }),
    },
    close: {
      text: t('pages.task.table.dropdown.close'),
      onClick: () => emit('moveTask', { id, status: 'finished' }),
    },
    archive: {
      text: t('pages.task.table.dropdown.archive'),
      onClick: () => emit('toggleArchive', id),
    },
    unarchive: {
      text: t('pages.task.table.dropdown.unarchive'),
      onClick: () => emit('toggleArchive', id),
    },
  };

  return dropdown[action];
};

const header = [
  {
    title: t('pages.task.table.header.title'),
    key: 'title',
    sortable: true,
    width: 680,
  },
  {
    title: t('pages.task.table.header.deadline_at'),
    key: 'deadline_at',
    width: 140,
  },
  { title: t('pages.task.table.header.type'), key: 'type' },
  {
    title: t('pages.task.table.header.students'),
    key: 'students',
  },
  {
    title: t('pages.task.table.header.delivered'),
    key: 'delivered',
    width: 140,
  },
  { title: '', key: 'actions', sortable: false, width: 100 },
].filter(({ key }) => {
  if (!props.individualJourney) {
    return true;
  }

  return key !== 'students' && key !== 'type';
});

const setAcceptedGroups = (task: TaskItem) => {
  const deliveredTotal = task.delivered ? task.delivered.underReview + task.delivered.completed : 0;

  const withDeliveries = computed(() => {
    return deliveredTotal > 0 ? ['published', 'finished'] : ['draft', 'published', 'finished'];
  });

  const statusMap: { [key: string]: string[] } = {
    draft: ['published', 'draft', 'finished'],
    published: withDeliveries.value,
    finished: withDeliveries.value,
  };

  return statusMap[task.status] || [];
};

const isTaskMovable = (task: TaskItem) => {
  return (task.title && task.finish_at && task.type && task.start_at && !task.archived_at) || false;
};

const setDragStart = (task: TaskItem, e: DragEvent) => {
  if (previewRow(task.id) || !isTaskMovable(task)) return;
  const acceptedGroups = setAcceptedGroups(task);
  if (!isArchived.value) {
    setTimeout(() => {
      emit('startDrag', task.id, e, acceptedGroups);
    }, 0);
  }
};

const setDragOver = (id: number, position: number, e: DragEvent) => {
  if (previewRow(id)) {
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    return;
  }
  const newIndex = tableSortBy.value.length || props.activeFilter ? -1 : position;
  if (!isArchived.value) emit('dragOver', props.group, id, newIndex, e);
};

const previewRow = (id: number) => {
  return id === -1;
};
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

.dnd-list-enter-active,
.dnd-list-leave-active,
.dnd-list-move {
  transition: all 0.125s linear;
}

.dnd-list-leave-active,
.list-leave-active {
  position: absolute;
  width: 80%;
  opacity: 0;
}

.list-enter-from {
  opacity: 0;
}
</style>
