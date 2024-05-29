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
        :tasks="tasks.filter((task) => column.group === task.status)"
        :title="column.title"
        :color="column.color"
        :group="column.group"
        :accept="column.accept"
        @click:card="handleClickCard"
        @change-card="handleChangeCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMouse } from '@vueuse/core';
import { Accept, Task } from './column/index.vue';
type Colors = 'orange' | 'green' | 'blue' | 'gray';
interface Column {
  title: string;
  group: string;
  color: Colors;
  accept: Accept<Task>;
}
interface KanbanProps {
  columns: Column[];
}
defineProps<KanbanProps>();
const tasks = defineModel<Task[]>('tasks', { required: true });
const emit = defineEmits(['click:filter', 'click:card']);
const { x: mouseX, y: mouseY } = useMouse({ window, type: 'client' });
const kanban = ref<HTMLDivElement | null>(null);
const handleClickFilter = () => {
  emit('click:filter');
};
const handleClickCard = () => {
  emit('click:card');
};
const handleChangeCard = ({
  value,
  group,
}: {
  newIndex: number;
  value: Task;
  group: string;
}) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === value.id) {
      return { ...task, status: group };
    }
    return task;
  });
};
const moveViewX = () => {
  if (!kanban.value) return;
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  if (!isDragging) return;
  const rect = kanban.value.getBoundingClientRect();
  const x = mouseX.value - rect.left;
  const padding = 20;
  if (x < padding) {
    kanban.value.scrollTo({ left: 0, behavior: 'smooth' });
  }
  if (x > rect.width - padding) {
    kanban.value.scrollTo({ left: rect.width * 2, behavior: 'smooth' });
  }
};
const moveViewY = () => {
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  if (!isDragging) return;
  const html = document.querySelector('html');
  if (!html) return;
  const y = Math.abs(mouseY.value);
  if (y < window.innerHeight * 0.22) {
    html.scrollTop -= 8;
  }
  if (y > window.innerHeight * 0.65) {
    html.scrollTop += 8;
  }
};
watch(mouseX, moveViewX);
watch(mouseY, moveViewY);
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
