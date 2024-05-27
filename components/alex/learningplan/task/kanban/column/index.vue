<template>
  <div class="flex-1 scroll-snap min-w-[280px] select-none">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="tasks.length"
      :color="color"
    />
    <SlickList
      v-model:list="tasks"
      :group="group"
      class="flex flex-col py-2"
      helper-class="kanban-helper"
      :accept="accept"
    >
      <SlickItem
        v-for="(task, i) in tasks"
        :key="task.id"
        :index="i"
        class="kanban-card-item"
      >
        <alex-learningplan-task-card
          class="kanban-card-item-inner mt-2 select-none"
          :date="task.date"
          :name="task.user.name"
          :student-class="task.studentClass"
          :status="status"
          :avatar="task?.user.avatar"
          :mark="task.mark"
          :max-mark="task.maxMark"
          @click="handleClickCard"
        />
      </SlickItem>
    </SlickList>
  </div>
</template>

<script setup lang="ts">
import { SlickList, SlickItem } from 'vue-slicksort';
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
  accept?: string[];
  group: string;
}
const props = defineProps<ColumnProps>();
const tasks = defineModel<Task[]>({ required: true });
const emit = defineEmits(['click:card', 'dragged:task']);
const handleClickCard = () => {
  emit('click:card');
};
const mappedStatus = {
  gray: 'to_do',
  blue: 'in_progress',
  orange: 'in_review',
  green: 'done',
};
const status = computed(() => mappedStatus[props.color]);
</script>

<style lang="scss" scoped>
.kanban-card-item {
  .kanban-card-item-inner {
    cursor: grab;
    transition:
      background 0.2s,
      transform 0.2s;
  }

  &.kanban-helper .kanban-card-item-inner {
    transform: rotate(5deg);
    box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.15);
  }
}
</style>
