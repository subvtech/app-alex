<script setup lang="ts" generic="T extends { id: number; position: number; status: string }">
import { SlickItem, SlickList } from 'vue-slicksort';
import { Droppable } from '../-types';
import KanbanColumn from './KanbanColumn.vue';
import { Colors } from './KanbanColumnHeader.vue';

export interface Column {
  title: string;
  group: string;
  color: Colors;
  accept?: ComponentProps<typeof KanbanColumn>['accept'];
  disable?: boolean;
}

type Slot<U> = {
  card(props: { item: U }): any;
};

defineSlots<Slot<T>>();

const columns = defineModel<Column[]>({
  default: () => [],
});

const items = defineModel<Droppable<T>[]>('items', {
  default: () => [],
});

const columnItems = ref<Record<string, Droppable<T>[]>>({});
const canDrag = ref(true);
const isDraggingItems = ref(false);
const modalDeleteColumn = ref(false);
const selectedDeleteGroup = ref<{ group: string; lenght: number } | null>(null);

const confirmDeleteI18n = computed(() => ({
  title: selectedDeleteGroup.value?.lenght
    ? 'No momento não é possível excluir esta coluna!'
    : 'Deseja realmente excluir essa coluna?',
  subtitle: selectedDeleteGroup.value?.lenght
    ? 'Para remover esta coluna é necessário que ela esteja vazia. Mova todas as tarefas para outra coluna para realizar essa ação.'
    : 'Esse processo é irreversível',
  cancel: selectedDeleteGroup.value?.lenght ? 'Entendi' : 'Cancelar',
}));

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
    color: 'gray',
    group: `column-${columns.value.length + 1}`,
    title: '',
  });

  setTimeout(() => {
    document.querySelector<HTMLInputElement>(`#${columns.value.at(-1)?.group} input`)?.focus();
  }, 100);
};

const handleCancelColumn = (group: string) => {
  columns.value = columns.value.filter((column) => column.group !== group);
};

const handleConfirmDeleteColumn = (group: string) => {
  selectedDeleteGroup.value = { group, lenght: columnItems.value[group].length };
  modalDeleteColumn.value = true;
};

const handleDeleteColumn = () => {
  const group = selectedDeleteGroup.value?.group;
  if (!group || columnItems.value[group].length) return;
  columns.value = columns.value.filter((v) => v.group !== group);
  selectedDeleteGroup.value = null;
  modalDeleteColumn.value = false;
};

const handleInsertCard = (values: { newIndex: number; value: Droppable<T>; group: string }) => {
  items.value = items.value.map((item) => {
    if (item.raw.id === values.value.raw.id) {
      item.group = values.group;
      item.raw.status = values.group;
    }
    return item;
  });
};

const handleUpdateList = (list: Droppable<T>[]) => {
  items.value = items.value.map((item) => {
    const index = list.findIndex((i) => i.raw.id === item.raw.id);
    if (index !== -1) item.raw.position = index;
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

const handleSortStart = () => {
  isDraggingItems.value = true;
};

const handleSortEnd = () => {
  isDraggingItems.value = false;
};

setColumnItems();

defineExpose({ canDrag, setCanDrag });

watch(items, setColumnItems, { deep: true });
</script>

<template>
  <div>
    <SlickList
      v-model:list="columns"
      use-drag-handle
      axis="x"
      class="tw-w-full tw-flex tw-flex-grow tw-overflow-x-auto tw-overflow-y-hidden bg-white tw-rounded-lg tw-relative tw-select-none"
      :disabled="!canDrag || isDraggingItems"
      :distance="15"
    >
      <SlickItem v-for="(column, i) in columns" :key="column.group" :index="i">
        <KanbanColumn
          :key="column.group"
          v-model="columnItems[column.group]"
          class="tw-mr-2"
          :color="column.color"
          :group="column.group"
          :title="column.title"
          @add-item="console.log($event)"
          @cancel-column="handleCancelColumn"
          @delete="handleConfirmDeleteColumn(column.group)"
          @insert-card="handleInsertCard"
          @sort-end="handleSortEnd"
          @sort-start="handleSortStart"
          @title-column-change="handleTitleChange"
          @update-list="handleUpdateList"
        >
          <template #card="{ item }">
            <slot name="card" :item="item.raw"></slot>
          </template>
        </KanbanColumn>
      </SlickItem>
      <div
        class="tw-flex tw-items-center tw-justify-center tw-min-w-[280px] tw-h-[63px] tw-rounded-lg tw-gap-2 tw-border-dashed tw-border tw-border-gray-400 add-button"
        @click="handleAddColumn"
      >
        <v-icon size="20px">mdi-plus</v-icon>
        <span class="text-body-4 text-gray-800">Adicionar coluna</span>
      </div>
    </SlickList>
    <alex-custom-confirm-dialog
      v-model="modalDeleteColumn"
      no-input-confirmation
      submit-button-text="Excluir"
      variant="error"
      :cancel-button-text="confirmDeleteI18n.cancel"
      :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
      :no-submit-button="!!selectedDeleteGroup?.lenght"
      :subtitle="confirmDeleteI18n.subtitle"
      :title="confirmDeleteI18n.title"
      @cancel="modalDeleteColumn = false"
      @submit="handleDeleteColumn"
    />
  </div>
</template>

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
