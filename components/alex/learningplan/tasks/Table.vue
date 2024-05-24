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
          v-for="(item, index) in items"
          :key="item.id"
          class="text-5 text-gray-600 text-no-wrap staggered-fade-item"
        >
          <td
            class="text-body-4 text-gray-800 max-w-170 width-170 text-overflow text-left"
          >
            {{ item.title }}
          </td>
          <td>
            <alex-learningplan-tasks-date-chip
              v-if="item.deadline_at"
              :date="item.deadline_at"
              :is-published="item.status === 'published'"
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
            <div v-if="item.students?.length" class="ml-2">
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
            <alex-learningplan-tasks-task-submissions
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
              :items="dropDownItems(index, item.status)"
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
}>();

const { t } = useI18n();
const transitionName = computed(() =>
  props.filter ? 'staggered-fade' : 'list',
);
const emit = defineEmits(['deleteTask']);

const deleteModal = ref(false);
const taskToDelete = ref(-1);

const tasksArray = computed(() => props.tasks);

const cancelDelete = () => {
  deleteModal.value = false;
  taskToDelete.value = -1;
};

const confirmDelete = () => {
  emit('deleteTask', taskToDelete.value);
  cancelDelete();
};

const dropDownItems = (index: number, type: string) => {
  const items = [
    {
      text: t('pages.task.table.dropdown.kanban'),
      onClick: () => console.log('kanban', index),
      warning: false,
    },
  ];

  if (
    type !== 'closed' &&
    !(
      tasksArray.value[index].delivered?.completed ||
      tasksArray.value[index].delivered?.underReview
    )
  ) {
    items.push({
      text: t('pages.task.table.dropdown.delete'),
      warning: true,
      onClick: () => {
        taskToDelete.value = tasksArray.value[index].id;
        deleteModal.value = true;
      },
    });
  }
  return items;
};

const header = [
  { title: t('pages.task.table.header.name'), key: 'name' },
  { title: t('pages.task.table.header.deadline'), key: 'deadline' },
  { title: t('pages.task.table.header.type'), key: 'type' },
  {
    title: t('pages.task.table.header.members'),
    key: 'students',
    sortable: false,
  },
  { title: t('pages.task.table.header.delivery'), key: 'delivered' },
  { title: '', key: 'actions', sortable: false },
];
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
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
