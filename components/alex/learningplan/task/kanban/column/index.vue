<template>
  <div class="flex-1 scroll-snap min-w-[280px]">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="tasks.length"
      :color="color"
    />
    <div class="d-flex flex-column">
      <alex-learningplan-task-card
        v-for="(task, index) in tasks"
        :key="task.id"
        class="mt-4 flex-fill"
        :class="[
          dragging ? 'dragging' : '',
          over == index && dragging && dragFrom != task ? 'over' : '',
        ]"
        :date="task.date"
        :name="task.user.name"
        :student-class="task.studentClass"
        :status="mappedStates[color]"
        :avatar="task?.user.avatar"
        :mark="task.mark"
        :max-mark="task.maxMark"
        draggable="true"
        @click="handleClickCard"
        @dragover="
          (e: DragEvent) => {
            onDragOver(index, e);
          }
        "
        @dragend="
          () => {
            finishDrag(task, index, tasks);
            emit('dragged:task', index);
          }
        "
        @dragstart="
          (e: DragEvent) => {
            startDrag(task, e);
          }
        "
        @dragenter="
          (e: DragEvent) => {
            e.preventDefault();
          }
        "
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
const { over, dragFrom, dragging, startDrag, finishDrag, onDragOver } =
  useDragDrop();
const mappedStates = {
  gray: 'to_do',
  blue: 'in_progress',
  orange: 'in_review',
  green: 'done',
};
// watch(dragging, () => {
//   console.log('dragging:', dragging.value);
// });
// watch(over, () => {
//   console.log('over:', dragging.value);
// });
</script>

<style scoped>
/* .dragging {
  box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.15);
} */
.over {
  background: #0002 !important;
}
.scroll-snap-align-start {
  scroll-snap-align: start;
}
</style>
