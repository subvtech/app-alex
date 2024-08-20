<template>
  <div class="bg-white tw-rounded-lg tw-relative">
    <SlickList
      v-model:list="columns"
      class="tw-w-full tw-flex tw-overflow-x-auto tw-overflow-y-hidden"
      :distance="15"
      axis="x"
      use-drag-handle
    >
      <SlickItem v-for="(column, i) in columns" :key="column.title" :index="i">
        <alex-learningplan-task-project-kanban-column
          :column="column"
          :items="items"
          :title="column.title"
          :group="column.group"
          :color="column.color"
          :accept="column.accept"
          class="tw-mr-2"
          @title-column-change="handleTitleChange"
          @add-item="console.log($event)"
        >
          <template #card="{ item }">
            <div>
              {{ item.id }}
            </div>
          </template>
        </alex-learningplan-task-project-kanban-column>
      </SlickItem>

      <div
        class="tw-flex tw-items-center tw-justify-center tw-min-w-[280px] tw-h-[63px] tw-rounded-lg tw-gap-2 tw-border-dashed tw-border tw-border-gray-400 add-button"
      >
        <v-icon size="20px">mdi-plus</v-icon>
        <span class="text-body-4 text-gray-800">Adicionar coluna</span>
      </div>
    </SlickList>
  </div>
</template>

<script setup lang="ts">
import { SlickList, SlickItem } from 'vue-slicksort';
import { Colors } from './column/Header.vue';
import { Accept } from './column/index.vue';
interface Column {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<any> | null;
  disable?: boolean;
}
// interface KanbanProps {
//   columns?: Column[];
// }
// withDefaults(defineProps<KanbanProps>(), {
//   columns: () => [],
// });
// refs
const columns = defineModel<Column[]>({
  default: () => [],
});
const items = ref<{ id: number }[]>([]);
const canDrag = ref(true);
const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
defineExpose({
  canDrag,
  setCanDrag,
});
const handleTitleChange = (group: string, value: string) => {
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      column.title = value;
    }
    return column;
  });
};
</script>

<style scoped lang="scss">
.add-button:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-gray-100));
}
.add-button:active {
  background-color: rgb(var(--v-theme-gray-200));
}
</style>
