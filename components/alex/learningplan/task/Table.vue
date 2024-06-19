<template>
  <v-data-table
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3 table"
    :items="tasksArray"
    :headers="header"
    :search="filter"
    hide-default-header
  >
    <template #body="{ items, headers }">
      <transition-group :name="transitionName">
        <tr
          v-for="item in items"
          :key="item.id"
          class="text-5 text-no-wrap staggered-fade-item"
          :class="isArchived ? 'text-gray-400' : 'text-gray-600'"
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
          <td class="d-flex align-center">
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
      </transition-group>
      <tr v-if="!items.length">
        <td :colspan="headers[0].length" class="text-center">
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
import { TaskType } from './Container.vue';
const props = defineProps<{
  tasks: TaskType[];
  filter: string;
  isArchived: boolean;
}>();

const { t } = useI18n();
const transitionName = computed(() =>
  props.filter ? 'staggered-fade' : 'list',
);
const { rewardStudents } = useContracts();

const emit = defineEmits(['deleteTask', 'moveTask', 'toggleArchive']);

const deleteModal = ref(false);
const taskToDelete = ref(-1);

const tasksArray = computed(() => props.tasks);
console.log({ tasks: props.tasks });

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
        items.push(getDropDownAction('delete', task.id));

        items.push(
          getDropDownAction('payReward', task.id, {
            address: task.contract_address,
            students: task.students,
          }),
        );
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

const getDropDownAction = (
  action: string,
  id: number,
  contract: { address?: string; students: string[] } = {
    students: [],
  },
) => {
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

    payReward: {
      text: 'pay students',
      onClick: async () => {
        console.log({ contract });
        await rewardStudents(contract.address, contract.students);
      },
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
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
</style>
