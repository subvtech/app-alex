<template>
  <div class="flex-1 scroll-snap min-w-[280px]">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="tasks.length"
      :color="color"
    />
    <div class="d-flex flex-column">
      <alex-learningplan-task-card
        v-for="task in tasks"
        :key="task.id"
        class="mt-4 flex-fill"
        :date="task.date"
        :name="task.user.name"
        :student-class="task.studentClass"
        :status="mappedStates[color]"
        :avatar="task?.user.avatar"
        :mark="task.mark"
        :max-mark="task.maxMark"
        @click="handleClickCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnProps {
  tasks: {
    id: number;
    status: string;
    date: Date;
    studentClass: string;
    user: { name: string; avatar?: string | null };
    mark?: number;
    maxMark?: number;
  }[];
  title: string;
  color: 'orange' | 'green' | 'blue' | 'gray';
}
defineProps<ColumnProps>();

const emit = defineEmits(['clickCard', 'dragged:task']);
const handleClickCard = () => {
  emit('clickCard');
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
