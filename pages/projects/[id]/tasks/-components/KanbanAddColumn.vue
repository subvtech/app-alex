<template>
  <div
    v-if="!isAddingColumn"
    class="tw-flex tw-items-center tw-justify-center tw-min-w-[280px] tw-h-[63px] tw-rounded-lg tw-gap-2 tw-border-dashed tw-border tw-border-gray-400 add-button"
    @click="handleStartAddColumn"
  >
    <v-icon size="20px">mdi-plus</v-icon>
    <span class="text-body-4 text-gray-800">Adicionar coluna</span>
  </div>
  <KanbanColumnHeader
    v-else
    id="adding-column"
    class="tw-h-[64px] tw-w-[280px]"
    :quantity="0"
    edit
    :color="!isPending ? 'gray-300' : 'secondary-0'"
    title=""
    :loading="isPending"
    disabled-interations
    @empty-title="isAddingColumn = false"
    @title-change="handleTitleChange"
  />
</template>

<script setup lang="ts">
import { useCreateColumn } from '../-composables/useKanban';
import { Kanban } from '../-types';
import KanbanColumnHeader from './KanbanColumnHeader.vue';
type Emit = {
  'add-column': [title: string];
};
type Props = {
  kanban?: Kanban;
  columnsLength?: number;
};
const props = withDefaults(defineProps<Props>(), { kanban: undefined, columnsLength: 0 });
const emit = defineEmits<Emit>();
const isAddingColumn = ref(false);
const { isPending, mutateAsync: createColumn } = useCreateColumn();
const handleStartAddColumn = () => {
  isAddingColumn.value = true;
  setTimeout(() => {
    document.querySelector<HTMLInputElement>(`#adding-column input`)?.focus();
  }, 100);
};
const handleTitleChange = async (title: string) => {
  if (!props.kanban) {
    return;
  }
  await createColumn({ kanbanId: props.kanban.id, position: props.columnsLength, title, statusType: 'doing' });
  emit('add-column', title);
  isAddingColumn.value = false;
};
</script>

<style scoped></style>
