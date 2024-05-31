<template>
  <div class="flex-1 scroll-snap min-w-[280px] select-none">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="items.length"
      :color="color"
    />
    <SlickList
      :list="items"
      :group="group"
      :accept="accept"
      class="flex flex-col py-2"
      helper-class="kanban-helper"
      @sort-insert="
        ({ newIndex, value }) => handleInsertCard({ newIndex, value, group })
      "
    >
      <SlickItem
        v-for="(item, i) in items"
        :key="item.id"
        :index="i"
        class="kanban-card-item"
      >
        <slot
          name="card"
          :item="item"
          :index="i"
          :status="status"
          :click="$emit('click:card', i, item as T)"
        />
      </SlickItem>
    </SlickList>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number; status: string }">
import { SlickList, SlickItem } from 'vue-slicksort';
import { TaskStatus } from '~/models/simple/taskSimple.model';
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
  color: 'orange' | 'green' | 'blue' | 'gray';
  accept?: Accept<T> | null;
  group: string;
}
const props = withDefaults(defineProps<ColumnProps>(), { accept: null });
const items = defineModel<T[]>({ required: true });
const emit = defineEmits<{
  'click:card': [index: number, item: T];
  'insert-card': [
    values: {
      newIndex: number;
      value: T;
      group: string;
    },
  ];
  'move-card': [
    values: {
      oldIndex: number;
      newIndex: number;
      event: MouseEvent;
    },
  ];
}>();
const isDragging = () => {
  const isDraggingCard = document.querySelector(
    '.kanban-card-item.kanban-helper',
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
const mappedStatus = {
  gray: 'to_do',
  blue: 'in_progress',
  orange: 'in_review',
  green: 'done',
};
const status = computed(() => mappedStatus[props.color] as TaskStatus);
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
