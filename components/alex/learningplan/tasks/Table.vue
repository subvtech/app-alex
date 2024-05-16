<template>
  <v-data-table
    v-if="index == 1"
    sort-asc-icon="mdi-arrow-up-thin"
    sort-desc-icon="mdi-arrow-down-thin"
    class="rounded-lg border-sm mb-4 text-gray-800 text-body-3"
    :items="tasks"
    :headers="header"
  >
    <template #item="{ item }">
      <tr class="text-5 text-gray-600 text-no-wrap">
        <td class="text-body-4 text-gray-800 max-w-170 text-overflow text-left">
          {{ item.name }}
        </td>
        <td>
          <alex-learningplan-tasks-date-chip
            :date="item.deadline"
            is-published
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
            v-if="item.delivered >= 0"
            :to-do="0"
            :doing="0"
            :under-review="0"
            :completed="11"
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
defineProps<{
  index: number;
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

const tasks = [
  {
    name: 'Criar um mapa mental sobre o vídeo',
    deadline: '10/10/2024',
    type: 'individual',
    students: [
      { name: 'João', avatar: 'https://picsum.photos/100/100' },
      { name: 'Maria Santos' },
    ],
    delivered: 1,
  },
  {
    name: 'Ler as páginas 9-12, 19-23 do livro',
    deadline: '05/16/2024',
    type: 'group',
    students: [
      { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
      { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
      { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
      { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
      { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
    ],
    delivered: -1,
  },
  {
    name: 'Criar uma protótipagem para a página de dashboard e depois assistir o jogo do Flamengo contra o bolivar que o flamengo tem que e vai ganhar pelo amor de Deus',
    deadline: '05/11/2024',
    type: 'group',
    students: [
      { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
      { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
      { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
      { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
      { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
    ],
    delivered: -1,
  },
  {
    name: 'Ser feliz né',
    deadline: '05/17/2024',
    type: 'group',
    students: [
      { name: 'João', image: { url: 'https://picsum.photos/110/100' } },
      { name: 'Maria', image: { url: 'https://picsum.photos/100/110' } },
      { name: 'José', image: { url: 'https://picsum.photos/110/105' } },
      { name: 'Ana', image: { url: 'https://picsum.photos/120/100}' } },
      { name: 'Carlos', image: { url: 'https://picsum.photos/100/120}' } },
    ],
    delivered: -1,
  },
];
</script>

<style scoped>
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
