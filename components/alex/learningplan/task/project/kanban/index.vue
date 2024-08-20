<template>
  <div class="bg-white tw-rounded-lg tw-relative">
    <!-- Categorias e seus respectivos alunos -->
    <div
      ref="kanban"
      class="tw-w-full tw-flex tw-gap-4 tw-overflow-x-auto tw-overflow-y-hidden"
    >
      <alex-learningplan-task-project-kanban-column
        v-for="column in columns"
        :key="column.title"
        :column="column"
        :title="column.title"
        :group="column.group"
        :color="column.color"
        :accept="column.accept"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Accept } from './column/index.vue';

type Colors = 'orange' | 'green' | 'blue' | 'gray';
interface Column {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<any> | null;
  disable?: boolean;
}
interface KanbanProps {
  columns?: Column[];
}

// useI18n();
// Models/props
withDefaults(defineProps<KanbanProps>(), {
  columns: () => [],
});

const canDrag = ref(true);
const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
defineExpose({
  canDrag,
  setCanDrag,
});
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
