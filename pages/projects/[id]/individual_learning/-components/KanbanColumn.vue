<template>
  <div class="tw-flex-1 tw-scroll-snap tw-min-w-[280px] tw-select-none">
    <KanbanColumnHeader :title="title" :quantity="items?.length" :color="color" />
    <SlickList
      class="tw-flex tw-flex-col tw-py-2"
      helper-class="kanban-card-dragging"
      :list="items"
      :group="group"
      :accept="accept"
      :distance="15"
      @sort-insert="({ newIndex, value }) => handleInsertCard({ newIndex, value, group })"
    >
      <SlickItem v-for="(item, i) in items" :key="item.id" :index="i" class="kanban-card-item" :disabled="disabled">
        <slot name="card" :item="item" :index="i" :status="status" />
      </SlickItem>
    </SlickList>
    <slot name="add" />

    <alex-custom-confirm-dialog
      v-model="confirm"
      variant="info"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :title="dialogText?.title || ''"
      :subtitle="dialogText?.subtitle || ''"
      :submit-button-text="$t('components.learningPlan.drawer.task.status.move.submit')"
      :cancel-button-text="$t('components.learningPlan.drawer.task.status.move.cancel')"
      no-input-confirmation
      @submit="
        if (confirmData !== undefined) {
          emit('insert-card', confirmData.values);
        }

        confirm = false;
      "
      @cancel="
        confirmData = undefined;
        confirm = false;
      "
    />
  </div>
</template>

<script setup lang="ts" generic="T extends { id: number; status: string; task?: TaskSimple }">
import { SlickItem, SlickList } from 'vue-slicksort';
import { TaskStatus } from '~/models/simple/taskSimple.model';
import KanbanColumnHeader from './KanbanColumnHeader.vue';

export type Accept<T> =
  | true
  | string[]
  | (({ source, dest, payload }: { source: HTMLElement; dest: HTMLElement; payload: T }) => boolean);
interface ColumnProps {
  title: string;
  color: 'orange' | 'green' | 'blue' | 'gray';
  accept?: Accept<T> | null;
  add?: boolean;
  group: string;
  disabled?: boolean;
}
const props = withDefaults(defineProps<ColumnProps>(), {
  accept: null,
  disable: false,
});
const items = defineModel<T[]>({ required: true });
const emit = defineEmits<{
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
  'create-task': [title: string];
}>();

// Confirm dialog
const confirm = ref<boolean>(false);
const confirmData = ref<any | undefined>(undefined);

const { setMessage } = useMessageStore();
const { t } = useI18n();
const learningPlanStore = useLearningPlanStore();
const isFacilitator = computed(() => learningPlanStore.userIsFacilitator);

const isDragging = () => {
  const isDraggingCard = document.querySelector('.kanban-card-item.kanban-card-dragging');
  return !!isDraggingCard;
};
const handleInsertCard = (values: { newIndex: number; value: T; group: string }) => {
  if (isDragging()) return;

  const cameFrom = values.value.status;
  const to = values.group;

  if (cameFrom === 'in_review' && !values.value.task?.can_change_from_review && !isFacilitator.value) {
    setMessage(t('components.learningPlan.drawer.task.status.move.warning'), 'warning', true);

    return;
  }

  if (to === 'in_review') {
    confirm.value = true;
    confirmData.value = { values, text: 'add' };
    return;
  }

  if (cameFrom === 'in_review' && to !== 'done') {
    confirm.value = true;
    confirmData.value = { values, text: 'remove' };
    return;
  }

  emit('insert-card', values);
};
const mappedStatus = {
  gray: 'to_do',
  blue: 'in_progress',
  orange: 'in_review',
  green: 'done',
};
const status = computed(() => mappedStatus[props.color] as TaskStatus);

const dialogText = computed(() => {
  if (confirmData.value === undefined) {
    return undefined;
  }

  const textSet: 'remove' | 'add' = confirmData.value.text;

  const title: string = t(`components.learningPlan.drawer.task.status.${textSet}.title`);
  const subtitle: string = t(`components.learningPlan.drawer.task.status.${textSet}.subtitle`);

  return {
    title,
    subtitle,
  };
});
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
</style>
