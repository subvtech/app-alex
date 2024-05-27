<template>
  <div class="mt-8 bg-white rounded-lg py-6 px-4 md:p-6 relative">
    <!-- Inputs -->
    <div class="d-flex align-center ga-3">
      <alex-inputs-text-field
        name="aluno"
        :placeholder="$t('components.courses.tasks.srchStudent')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-full mr-auto min-w-40 max-w-80"
        density="comfortable"
      />
      <!-- Deixar filtrar funcional -->
      <v-tooltip text="Filtrar" location="bottom" content-class="bg-gray-800">
        <template #activator="{ props }">
          <alex-custom-button
            v-bind="props"
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
            @click="handleClickFilter"
          />
        </template>
      </v-tooltip>
    </div>

    <!-- "Hr" decorativo -->
    <v-divider class="my-4" />

    <!-- Categorias e seus respectivos alunos -->
    <div
      ref="kanban"
      class="w-full flex gap-4 pa-0 overflow-x-auto overflow-y-hidden"
    >
      <alex-learningplan-task-kanban-column
        v-for="(column, index) in columns"
        :key="index"
        v-model="column.tasks"
        :title="column.title"
        :color="column.color"
        :group="column.group"
        :accept="column.accept"
        @click:card="handleClickCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouse } from '@vueuse/core';

const columns = ref<
  {
    title: string;
    color: 'orange' | 'green' | 'blue' | 'gray';
    tasks: any[];
    group: string;
    accept?: string[];
  }[]
>([
  {
    title: 'A fazer',
    color: 'gray',
    tasks: [
      {
        id: 1,
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        id: 2,
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe b',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        id: 3,
        status: 'to_do',
        date: new Date(),
        studentClass: 'Classe c',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
    ],
    group: 'to_do',
    accept: ['to_do', 'in_progress', 'in_review', 'done'],
  },
  {
    title: 'Em andamento',
    color: 'blue',
    tasks: [
      {
        id: 4,
        status: 'in_progress',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
      {
        id: 5,
        status: 'in_progress',
        date: new Date(),
        studentClass: 'Classe A',
        user: {
          name: 'Jorge',
        },
        mark: 1,
        maxMark: 10,
      },
    ],
    group: 'in_progress',
    accept: ['to_do', 'in_progress', 'in_review', 'done'],
  },
  {
    title: 'Em avaliação',
    color: 'orange',
    tasks: [],
    group: 'in_review',
    accept: ['to_do', 'in_progress', 'in_review', 'done'],
  },
  {
    title: 'Concluído',
    color: 'green',
    tasks: [],
    group: 'done',
    accept: ['to_do', 'in_progress', 'in_review', 'done'],
  },
]);
// interface Kanban {}
const emit = defineEmits(['clickFilter', 'clickCard']);
const { x: mouseX } = useMouse();
const kanban = ref<HTMLDivElement | null>(null);
const handleClickFilter = () => {
  emit('clickFilter');
};
const handleClickCard = () => {
  emit('clickCard');
};
const mouseXInElement = () => {
  if (!kanban.value) return;
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  if (!isDragging) return;
  const rect = kanban.value.getBoundingClientRect();
  const x = mouseX.value - rect.left;
  const padding = 0;
  if (x < padding) {
    kanban.value.scrollTo({ left: 0, behavior: 'smooth' });
  }
  if (x > rect.width - padding) {
    kanban.value.scrollTo({ left: rect.width * 2, behavior: 'smooth' });
  }
};
watch(mouseX, mouseXInElement);
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
