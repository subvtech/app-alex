<template>
  <div
    :id="group"
    class="tw-flex-1 tw-scroll-snap tw-min-w-[280px] tw-select-none"
  >
    <DragHandle>
      <alex-learningplan-task-project-kanban-column-header
        :title="title"
        :quantity="items.length"
        :color="color"
        class="tw-max-w-[280px] tw-cursor-grab"
        @title-change="$emit('title-column-change', group, $event)"
        @empty-title="$emit('cancel-column', group)"
        @add="$emit('add-item', group)"
        @delete="$emit('delete', group)"
      />
    </DragHandle>
    <SlickList
      v-model:list="items"
      class="tw-flex tw-flex-col tw-py-2"
      helper-class="kanban-card-dragging"
      :group="group"
      :accept="accept"
      :distance="15"
      @sort-start="$emit('sort-start', group)"
      @sort-insert="
        ({ newIndex, value }) => handleInsertCard({ newIndex, value, group })
      "
      @sort-end="
        ({ newIndex, oldIndex }) =>
          $emit('sort-end', {
            newIndex,
            oldIndex,
            group,
            id: items[newIndex].raw.id,
          })
      "
      @update:list="(list) => $emit('update-list', list)"
    >
      <SlickItem
        v-for="(item, i) in items"
        :key="item.raw.id"
        :index="i"
        class="kanban-card-item tw-mb-2"
        :disabled="disabled"
      >
        <slot name="card" :item="item" :index="i" />
      </SlickItem>
    </SlickList>
    <div
      v-if="addButton"
      class="tw-flex tw-items-center tw-justify-center tw-min-w-[280px] tw-h-[44px] tw-rounded-lg tw-gap-2 tw-border-dashed tw-border tw-border-gray-400 text-gray-800 add-button bg-white"
      @click="$emit('add-item', group)"
    >
      <v-icon size="20px">mdi-plus</v-icon>
      <span class="text-body-4">{{ addButtonText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends { raw: { id: number } }">
import { SlickList, SlickItem, DragHandle } from 'vue-slicksort';
import { Colors } from './Header.vue';
export type Accept<T> =
  | true
  | string[]
  | (({
      source,
      dest,
      payload,
    }: {
      source: HTMLElement;
      dest: HTMLElement;
      payload: T;
    }) => boolean);
interface ColumnProps {
  title: string;
  group: string;
  color?: Colors;
  accept?: Accept<T> | null;
  disabled?: boolean;
  addButton?: boolean;
  addButtonText?: string;
}
type Slot = {
  card(props: { item: T; index: number }): any;
};
defineSlots<Slot>();
withDefaults(defineProps<ColumnProps>(), {
  accept: true,
  disable: false,
  color: 'gray',
  addButtonText: 'Adicionar',
  addButton: true,
});
const items = defineModel<T[]>({ default: () => [] });
const emit = defineEmits<{
  'insert-card': [
    values: {
      newIndex: number;
      value: T;
      group: string;
    },
  ];
  'sort-end': [
    values: { oldIndex: number; newIndex: number; group: string; id: number },
  ];
  'title-column-change': [group: string, title: string];
  'add-item': [group: string];
  'cancel-column': [group: string];
  'update-list': [list: T[]];
  delete: [group: string];
  'sort-start': [group: string];
}>();

const isDragging = () => {
  const isDraggingCard = document.querySelector(
    '.kanban-card-item.kanban-card-dragging',
  );
  return !!isDraggingCard;
};
const handleInsertCard = (values: {
  newIndex: number;
  value: T;
  group: string;
}) => {
  if (isDragging()) return;
  emit('insert-card', values);
};
</script>

<style lang="scss" scoped>
.kanban-card-item {
  border-radius: 8px;
  &.kanban-card-dragging {
    cursor: grab;
    max-height: 118px;
    box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.15);
  }
}
:deep(.kanban-card-item-inner) {
  margin-top: 8px;
}
:global(.kanban-card-dragging .kanban-card-item-inner) {
  margin-top: 0px;
}
.add-button:hover {
  cursor: pointer;
  background-color: rgb(var(--v-theme-gray-100));
}
.add-button:active {
  background-color: rgb(var(--v-theme-gray-200));
}
</style>
