<template>
  <v-data-table
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table"
    :class="over != -1 && tableSortBy.length ? 'table-drop' : ''"
    :items="tasksArray"
    :headers="header"
    :search="filter"
    hide-default-header
    @dragleave="(e) => emit('dragLeave', e)"
    @update:sort-by="(e) => (tableSortBy = e)"
  >
    <template #item="{ item, columns }">
      <transition-group :name="transitionName">
        <tr
          v-if="item.id !== -1"
          :draggable="!isArchived"
          class="text-5 text-no-wrap staggered-fade-item table-row"
          :class="[
            isArchived ? 'text-gray-400' : 'text-gray-600',
            dragging && dragFrom == item.id ? 'dragging' : '',
          ]"
          @dragstart="(e) => setDragStart(item, e)"
          @dragover.prevent="(e) => setDragOver(item.id, item.position, e)"
          @dragend="emit('dragEnd', item)"
        >
          <td
            class="text-body-4 text-overflow text-left"
            :class="isArchived ? 'text-gray-400' : 'text-gray-800'"
          >
            {{ item.title }}
          </td>
          <td>
            <alex-learningplan-task-date-chip
              v-if="item.deadline_at"
              :date="item.deadline_at"
              :is-published="item.status === 'published' && !isArchived"
            />
            <span v-else>{{
              $t('pages.task.table.placeholders.undefined')
            }}</span>
          </td>
          <td>
            <div v-if="item.type">
              <v-icon
                class="mr-1"
                :icon="
                  item.type === 'group'
                    ? 'mdi-account-multiple-outline'
                    : 'mdi-account-outline'
                "
              />
              <span>{{
                item.type === 'group'
                  ? $t('pages.task.table.type.group')
                  : $t('pages.task.table.type.individual')
              }}</span>
            </div>
            <span v-else>{{
              $t('pages.task.table.placeholders.undefined')
            }}</span>
          </td>
          <td>
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
          <td>
            <alex-learningplan-task-submissions
              v-if="item.delivered"
              :submitted="item.delivered"
            />
            <div v-else>
              <v-icon class="mr-1" icon="mdi-close-circle-outline "></v-icon>
              <span>{{ $t('pages.task.submissions.noSubmissions') }}</span>
            </div>
          </td>
          <td>
            <v-tooltip
              :text="t('pages.task.table.tooltips.kanban')"
              location="bottom center"
            >
              <template #activator="{ props }">
                <alex-custom-button
                  v-bind="props"
                  icon="alex:Kanban"
                  variant="text"
                />
              </template>
            </v-tooltip>
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
                      v-bind="{ ...propsMenu, ...optionsTooltipProps }"
                      icon="mdi-dots-vertical"
                    />
                  </template>
                </v-tooltip>
              </template>
            </alex-custom-dropdown>
          </td>
        </tr>

        <tr v-else class="row-drop row-preview">
          <td :colspan="columns.length"></td>
        </tr>
      </transition-group>
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
import { TaskType } from './Container.vue';
const props = defineProps<{
  tasks: TaskType[];
  filter: string;
  group: string;
  dragging: boolean;
  over: number;
  dragFrom: number;
}>();

const { t } = useI18n();
const isArchived = computed(() => props.group === 'archived');
const typing = ref(false);

const filter = computed(() => props.filter);

watch(filter, () => {
  typing.value = true;
  setTimeout(() => {
    typing.value = false;
  }, 1000);
});

const transitionName = computed(() =>
  typing.value ? 'staggered-fade' : 'list',
);
const emit = defineEmits([
  'deleteTask',
  'moveTask',
  'toggleArchive',
  'dragOver',
  'dragEnd',
  'startDrag',
  'dragLeave',
]);

const tableSortBy = ref<string[]>([]);
const deleteModal = ref(false);
const taskToDelete = ref(-1);
const tasksArray = computed(() => {
  const array = [...props.tasks];
  const index = array.findIndex((task) => task.id === props.over);
  const oldIndex = array.findIndex((task) => task.id === -1);
  if (oldIndex === props.over || tableSortBy.value.length) return array;
  if (oldIndex !== -1) {
    array.splice(oldIndex, 1);
  }
  const item = {
    id: -1,
    title: '',
    status: '',
    position: index,
    delivered: {
      toDo: 0,
      doing: 0,
      underReview: 0,
      completed: 0,
    },
  };
  if (index !== -1) {
    if (index + 1 === array.length) {
      array.push(item);
    } else {
      array.splice(index, 0, item);
    }
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

const dropDownItems = (task: TaskType) => {
  const deliveredTotal = task.delivered
    ? task.delivered.underReview + task.delivered.completed
    : 0;
  const items = [
    getDropDownAction('details', task.id),
    getDropDownAction('kanban', task.id),
  ];
  switch (task.status) {
    case 'draft':
      items.push(getDropDownAction('publish', task.id));
      items.push(getDropDownAction('delete', task.id));
      break;
    case 'published':
      if (deliveredTotal === 0) {
        items.push(getDropDownAction('draft', task.id));
        items.push(getDropDownAction('close', task.id));
        items.push(getDropDownAction('delete', task.id));
      } else if (task.archived) {
        items.push(getDropDownAction('unarchive', task.id));
      } else {
        items.push(getDropDownAction('close', task.id));
        items.push(getDropDownAction('archive', task.id));
      }
      break;
    case 'done':
      if (deliveredTotal === 0) {
        items.push(getDropDownAction('draft', task.id));
        items.push(getDropDownAction('publish', task.id));
        items.push(getDropDownAction('delete', task.id));
      } else if (task.archived) {
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
      onClick: () => console.log('details', id),
    },
    kanban: {
      text: t('pages.task.table.dropdown.kanban'),
      onClick: () => console.log('kanban', id),
    },
    draft: {
      text: t('pages.task.table.dropdown.draft'),
      onClick: () => emit('moveTask', { id, status: 'draft' }),
    },
    close: {
      text: t('pages.task.table.dropdown.close'),
      onClick: () => emit('moveTask', { id, status: 'done' }),
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
    title: t('pages.task.table.header.name'),
    key: 'title',
    sortable: true,
    width: 680,
  },
  {
    title: t('pages.task.table.header.deadline'),
    key: 'deadline_at',
    width: 140,
  },
  { title: t('pages.task.table.header.type'), key: 'type' },
  {
    title: t('pages.task.table.header.members'),
    key: 'students',
  },
  {
    title: t('pages.task.table.header.delivery'),
    key: 'delivered',
  },
  { title: '', key: 'actions', sortable: false },
];

const setAcceptedGroups = (task: TaskType) => {
  const deliveredTotal = task.delivered
    ? task.delivered.underReview + task.delivered.completed
    : 0;

  const statusMap: { [key: string]: string[] } = {
    draft: ['published', 'draft'],
    published:
      deliveredTotal === 0
        ? ['draft', 'done', 'published']
        : ['published', 'done'],
    done: ['published', 'done'],
  };

  return statusMap[task.status] || [];
};

const setDragStart = (task: TaskType, e: DragEvent) => {
  const acceptedGroups = setAcceptedGroups(task);
  if (!isArchived.value) emit('startDrag', task.id, e, acceptedGroups);
};

const setDragOver = (id: number, position: number, e: DragEvent) => {
  const newIndex = tableSortBy.value.length ? -1 : position;
  if (!isArchived.value) emit('dragOver', props.group, id, newIndex, e);
};
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row {
  cursor: pointer;
  background-color: #fff;
}

.table-drop,
.row-drop {
  border: 1.5px dashed rgb(var(--v-theme-gray-400)) !important;
}

.dragging {
  background-color: rgb(var(--v-theme-gray-blue));
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

.list-move,
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

.row-drop {
  transition-timing-function: cubic-bezier(0.57, 0.06, 0, 1.06);
  transition-duration: 1200ms;
  transition-property: opacity, transform;
}

.staggered-fade-enter,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
