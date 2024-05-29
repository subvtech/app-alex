<template>
  <div class="flex-1 scroll-snap min-w-[280px] select-none">
    <alex-learningplan-task-kanban-column-header
      :title="title"
      :quantity="items.length"
      :color="color"
    />
    <SlickList
      v-model:list="items"
      :group="group"
      class="flex flex-col py-2"
      helper-class="kanban-helper"
      :accept="accept"
      @sort-insert="
        ({ newIndex, value }) =>
          $emit('change-card', { newIndex, value, group })
      "
    >
      <SlickItem
        v-for="(item, i) in items"
        :key="item.id"
        :index="i"
        class="kanban-card-item"
      >
        <slot name="card" :item="item" :index="i" :status="status" />
      </SlickItem>
    </SlickList>
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number }">
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
  accept?: Accept<T>;
  group: string;
  items: T[];
}
const props = defineProps<ColumnProps>();
const items = ref(props.items);
defineEmits<{
  'click:card': [];
  'change-card': [
    values: {
      newIndex: number;
      value: T;
      group: string;
    },
  ];
}>();
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
