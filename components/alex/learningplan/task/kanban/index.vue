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
        <template #activator="{ props: propsFilter }">
          <alex-custom-button
            v-bind="propsFilter"
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
        :items="tasks.filter((task) => column.group === task.status)"
        :title="column.title"
        :color="column.color"
        :group="column.group"
        :accept="column.accept"
        @click:card="handleClickCard"
        @change-card="handleChangeCard"
      >
        <template #card="{ item, status }">
          <template v-if="type === 'professor'">
            <alex-learningplan-task-card
              v-if="!isTaskStudent(item)"
              class="kanban-card-item-inner mt-2 select-none"
              :date="item.date"
              :name="item.user.name"
              :student-class="item.studentClass"
              :status="status"
              :avatar="item?.user.avatar"
              :mark="item.mark"
              :max-mark="item.maxMark"
            />
          </template>
          <template v-if="type === 'student'">
            <alex-learningplan-task-student-card
              v-if="isTaskStudent(item)"
              class="kanban-card-item-inner mt-2 select-none"
              :title="item.title"
              :date="item.date"
              :group="item.group"
              :name-group="item.nameGroup"
              :status="status"
              :avatar="item?.avatar"
              :mark="item.mark"
              :max-mark="item.maxMark"
            />
          </template>
        </template>
      </alex-learningplan-task-kanban-column>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends 'professor' | 'student'">
import { useMouse } from '@vueuse/core';
import { Accept } from './column/index.vue';
import { TaskStatus } from '~/models/simple/taskSimple.model';

export interface Task {
  id: number;
  status: string;
  date: Date;
  studentClass: string;
  user: { name: string; avatar?: string | null };
  mark?: number;
  maxMark?: number;
}
export interface TaskStudent {
  id: number;
  date: Date;
  title: string;
  group?: boolean;
  nameGroup?: string;
  avatar?: string | null;
  status?: TaskStatus | (string & {});
  mark?: number;
  maxMark?: number;
}
type Colors = 'orange' | 'green' | 'blue' | 'gray';
type KanbanType = 'professor' | 'student';
type Card<T extends KanbanType> = T extends 'professor' ? Task : TaskStudent;
interface Column<T extends 'professor' | 'student'> {
  title: string;
  group: string;
  color: Colors;
  accept: Accept<Card<T>>;
}
interface KanbanProps {
  type: T;
}
const props = defineProps<KanbanProps>();
const tasks = defineModel<Card<typeof props.type>[]>('tasks', {
  required: true,
});
const columns = defineModel<Column<typeof props.type>[]>('columns', {
  required: true,
});
const emit = defineEmits(['click:filter', 'click:card']);
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
  value: Card<typeof props.type>;
  group: string;
}) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id === value.id) {
      return { ...task, status: group };
    }
    return task;
  });
};

const isTaskStudent = (card: Task | TaskStudent): card is TaskStudent => {
  return 'title' in card;
};

// Scroll X and Y
const kanban = ref<HTMLDivElement | null>(null);
const { x: mouseX, y: mouseY } = useMouse({ window, type: 'client' });
const moveViewX = () => {
  if (!kanban.value) return;
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  if (!isDragging) return;
  const rect = kanban.value.getBoundingClientRect();
  const x = mouseX.value - rect.left;
  const padding = 20;
  if (x < padding) {
    kanban.value.scrollLeft -= 10;
  }
  if (x > rect.width - padding) {
    kanban.value.scrollLeft += 10;
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
  if (y > window.innerHeight * 0.68) {
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
