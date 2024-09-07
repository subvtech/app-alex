<script setup lang="ts" generic="T extends Droppable<{ id: number }>">
import { DragHandle, SlickItem, SlickList } from 'vue-slicksort';
import { Droppable } from '../-types';
import KanbanColumnHeader, { Colors } from './KanbanColumnHeader.vue';

type AcceptFunction<T> = (params: { dest: HTMLElement; payload: T; source: HTMLElement }) => boolean;

type Props<T> = {
  accept?: true | string[] | AcceptFunction<T> | null;
  addButton?: boolean;
  addButtonText?: string;
  color?: Colors;
  disabled?: boolean;
  group: string;
  title: string;
};

type Events<T> = {
  'add-item': [group: string];
  'cancel-column': [group: string];
  'insert-card': [values: { newIndex: number; value: T; group: string }];
  'sort-end': [values: { oldIndex: number; newIndex: number; group: string; id: number }];
  'sort-start': [group: string];
  'title-column-change': [group: string, title: string];
  'update-list': [list: T[]];
  delete: [group: string];
};

type Slots<T> = {
  card(props: { item: T; index: number }): any;
};

defineSlots<Slots<T>>();

const props = withDefaults(defineProps<Props<T>>(), {
  accept: true,
  disable: false,
  color: 'gray',
  addButtonText: 'Adicionar',
  addButton: true,
});

const items = defineModel<T[]>({ default: () => [] });

const emit = defineEmits<Events<T>>();

const isDragging = () => {
  const isDraggingCard = document.querySelector('.kanban-card-item.kanban-card-dragging');
  return !!isDraggingCard;
};

const handleSortEnd = (values: { newIndex: number; oldIndex: number }) => {
  emit('sort-end', { ...values, group: props.group, id: items.value[values.newIndex].raw.id });
};

const handleSortInsert = (values: { newIndex: number; value: T }) => {
  if (isDragging()) return;
  emit('insert-card', { ...values, group: props.group });
};
</script>

<template>
  <div :id="group" class="tw-flex-1 tw-scroll-snap tw-min-w-[280px] tw-select-none">
    <DragHandle>
      <KanbanColumnHeader
        class="tw-max-w-[280px] tw-cursor-grab"
        :color="color"
        :quantity="items.length"
        :title="title"
        @add="$emit('add-item', group)"
        @delete="$emit('delete', group)"
        @empty-title="$emit('cancel-column', group)"
        @title-change="$emit('title-column-change', group, $event)"
      />
    </DragHandle>
    <SlickList
      v-model:list="items"
      class="tw-flex tw-flex-col tw-py-2"
      helper-class="kanban-card-dragging"
      :accept="accept"
      :distance="15"
      :group="group"
      @sort-end="handleSortEnd"
      @sort-insert="handleSortInsert"
      @sort-start="$emit('sort-start', group)"
      @update:list="$emit('update-list', $event)"
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
