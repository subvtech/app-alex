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
            {{ item.name }}
          </td>
          <td>
            <alex-learningplan-tasks-date-chip
              v-if="item.deadline"
              :date="item.deadline"
              :is-published="item.status === 'published'"
            />
            <span v-else>Indefinido</span>
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
              {{ item.type }}
            </div>
            <span v-else>Indefinido</span>
          </td>
          <td>
            <alex-custom-avatar-group
              v-if="item.students"
              :avatar-items="item.students || []"
              :max="3"
            />
            <span v-else>Nenhum</span>
          </td>
          <td>
            <alex-learningplan-tasks-task-submissions
              v-if="item.delivered"
              :submitted="item.delivered"
            />
            <div v-else>
              <v-icon class="mr-1" icon="mdi-close-circle-outline "></v-icon>
              <span>Sem entrega</span>
            </div>
          </td>
          <td class="d-flex align-center">
            <v-tooltip text="Ver kanban" location="bottom">
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
                <v-tooltip text="Opções" location="bottom center">
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
          Nenhuma tarefa encontrada
        </td>
      </tr>
    </template>
    <template #bottom></template>
  </v-data-table>
  <alex-custom-confirm-dialog
    v-model="deleteModal"
    variant="error"
    :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
    title="Realmente deseja excluir essa Tarefa?"
    subtitle="Ao excluir uma tarefa todo o conteúdo criado dentro dela também será excluído."
    submit-button-text="Excluir"
    cancel-button-text="Cancelar"
    no-input-confirmation
    @submit="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
// import { Task } from "@/models/task.model"
const props = defineProps<{
  tasks: {
    id: number;
    status: string;
    name: string;
    deadline?: string;
    type?: string;
    students?: { name: string; image?: { url: string } }[];
    delivered?: {
      toDo: number;
      doing: number;
      underReview: number;
      completed: number;
    };
  }[];
  filter: string;
}>();
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
      text: 'Ver kanban',
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
      text: 'Excluir',
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
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'Prazo', key: 'deadline' },
  { title: 'Tipo', key: 'type' },
  { title: 'Integrantes', key: 'students', sortable: false },
  { title: 'Entrega', key: 'delivered' },
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
