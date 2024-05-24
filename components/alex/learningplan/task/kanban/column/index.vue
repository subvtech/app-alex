<template>
  <div class="flex-1 scroll-snap min-w-[280px]">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="tasks.length"
      :color="color"
    />
    <draggable
      v-model="tasks"
      tag="transition-group"
      :component-data="{ name: 'flip-list', tag: 'div' }"
      class="flex flex-col gap-2 mt-2 h-full"
      group="tasks"
      ghost-class="ghost"
      animation="100"
    >
      <template #item="{ element }">
        <alex-learningplan-task-card
          :key="element.id"
          :date="element.date"
          :name="element.user.name"
          :student-class="element.studentClass"
          :status="mappedStates[color]"
          :avatar="element?.user.avatar"
          :mark="element.mark"
          :max-mark="element.maxMark"
          @click="handleClickCard"
        />
      </template>
    </draggable>
    <div class="d-flex flex-column"></div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
interface Task {
  id: number;
  status: string;
  date: Date;
  studentClass: string;
  user: { name: string; avatar?: string | null };
  mark?: number;
  maxMark?: number;
}
interface ColumnProps {
  title: string;
  color: 'orange' | 'green' | 'blue' | 'gray';
}
defineProps<ColumnProps>();
const tasks = defineModel<Task[]>({ required: true });
const emit = defineEmits(['click:card', 'dragged:task']);
const handleClickCard = () => {
  emit('click:card');
};
const mappedStates = {
  gray: 'to_do',
  blue: 'in_progress',
  orange: 'in_review',
  green: 'done',
};
</script>

<style scoped>
.scroll-snap-align-start {
  scroll-snap-align: start;
}
</style>
