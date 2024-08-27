<template>
  <SlickList
    v-model:list="columns"
    class="tw-w-full tw-flex tw-flex-grow tw-overflow-x-auto tw-overflow-y-hidden bg-white tw-rounded-lg tw-relative tw-select-none"
    :distance="15"
    axis="x"
    use-drag-handle
  >
    <SlickItem v-for="(column, i) in columns" :key="column.group" :index="i">
      <alex-learningplan-task-project-kanban-column
        :key="column.group"
        v-model="columnItems[column.group]"
        :title="column.title"
        :group="column.group"
        :color="column.color"
        class="tw-mr-2"
        @title-column-change="handleTitleChange"
        @cancel-column="handleCancelColumn"
        @add-item="console.log($event)"
        @delete="handleDeleteColumn"
        @update-list="handleUpdateList"
        @insert-card="handleInsertCard"
      >
        <template #card="{ item }">
          <slot name="card" :item="item.raw" />
        </template>
      </alex-learningplan-task-project-kanban-column>
    </SlickItem>

    <div
      class="tw-flex tw-items-center tw-justify-center tw-min-w-[280px] tw-h-[63px] tw-rounded-lg tw-gap-2 tw-border-dashed tw-border tw-border-gray-400 add-button"
      @click="handleAddColumn"
    >
      <v-icon size="20px">mdi-plus</v-icon>
      <span class="text-body-4 text-gray-800">Adicionar coluna</span>
    </div>
  </SlickList>
</template>

<script
  setup
  lang="ts"
  generic="T extends { id: number; position: number; status: string }"
>
import { SlickList, SlickItem } from 'vue-slicksort';
import { Colors } from './column/Header.vue';
import { Accept } from './column/index.vue';
interface GenericItem<U> {
  group: string;
  raw: U;
}
interface Column<U> {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<GenericItem<U>> | null;
  disable?: boolean;
}
type Slot<U> = {
  card(props: { item: U }): any;
};

// refs
defineSlots<Slot<T>>();
const columns = defineModel<Column<T>[]>({
  default: () => [],
});
const items = defineModel<GenericItem<T>[]>('items', {
  default: () => [],
});
const columnItems = ref<Record<string, GenericItem<T>[]>>({});
const canDrag = ref(true);

// Methods
const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
const handleTitleChange = (group: string, value: string) => {
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      column.title = value;
      column.group = value.trim().toLowerCase().replace(/ /g, '_');
    }
    return column;
  });
  items.value = items.value.map((item) => {
    if (item.group === group) {
      item.group = value.trim().toLowerCase().replace(/ /g, '_');
    }
    return item;
  });
};
const handleAddColumn = () => {
  columns.value.push({
    title: '',
    group: `column-${columns.value.length + 1}`,
    color: 'gray',
  });
  setTimeout(() => {
    const input = document.querySelector<HTMLInputElement>(
      `#${columns.value[columns.value.length - 1].group} input`,
    );
    if (input) {
      input.focus();
    }
  }, 100);
};
const handleCancelColumn = (group: string) => {
  columns.value = columns.value.filter((column) => column.group !== group);
};
const handleDeleteColumn = (group: string) => {
  if (columnItems.value[group].length) return;
  columns.value = columns.value.filter((column) => column.group !== group);
};
const handleInsertCard = (values: {
  newIndex: number;
  value: GenericItem<T>;
  group: string;
}) => {
  items.value = items.value.map((item) => {
    if (item.raw.id === values.value.raw.id) {
      item.group = values.group;
      item.raw.status = values.group;
    }
    return item;
  });
};
const handleUpdateList = (list: GenericItem<T>[]) => {
  items.value = items.value.map((item) => {
    const updatedItemIndex = list.findIndex((i) => i.raw.id === item.raw.id);
    if (updatedItemIndex !== -1) {
      item.raw.position = updatedItemIndex;
    }
    return item;
  });
};
const setColumnItems = () => {
  columns.value.forEach((column) => {
    columnItems.value[column.group] = items.value
      .filter((item) => item.group === column.group)
      .sort((a, b) => a.raw.position - b.raw.position);
  });
};
setColumnItems();
watch(items, setColumnItems, { deep: true });
defineExpose({
  canDrag,
  setCanDrag,
});
</script>

<style scoped lang="scss">
.add-button:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-gray-100));
}
.add-button:active {
  background-color: rgb(var(--v-theme-gray-200));
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-move {
  transition: transform 0.3s ease;
}
</style>
