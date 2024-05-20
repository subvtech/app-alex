<template>
  <v-data-table
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3"
    :items="tasks"
    :headers="header"
    :search="filter"
  >
    <template #item="{ item }">
      <tr class="text-5 text-gray-600 text-no-wrap">
        <td
          class="text-body-4 text-gray-800 max-w-170 width-170 text-overflow text-left"
        >
          {{ item.name }}
        </td>
        <td>
          <alex-learningplan-tasks-date-chip
            :date="item.deadline"
            :is-published="item.status === 'published'"
          />
        </td>
        <td>
          <v-icon
            class="mr-1"
            :icon="
              item.type === 'group'
                ? 'mdi-account-multiple-outline'
                : 'mdi-account-outline'
            "
          />
          {{ item.type }}
        </td>
        <td>
          <alex-custom-avatar-group :avatar-items="item.students" :max="3" />
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
            :items="dropDownItems"
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
    </template>
    <template #bottom></template>
  </v-data-table>
</template>

<script setup lang="ts">
// import { Task } from "@/models/task.model"

defineProps<{
  tasks: {
    id: number;
    status: string;
    name: string;
    deadline: string;
    type: string;
    students: { name: string; image?: { url: string } }[];
    delivered?: {
      toDo: number;
      doing: number;
      underReview: number;
      completed: number;
    };
  }[];
  filter: string;
}>();

const dropDownItems = [
  { text: 'Excluir', warning: true, onClick: () => console.log('Excluir') },
];

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
</style>
