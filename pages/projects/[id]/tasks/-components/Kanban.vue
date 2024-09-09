<script setup lang="ts" generic="T extends { id: number; position: number; title: string; status: string }">
import { SlickItem, SlickList } from 'vue-slicksort';
import { Droppable } from '../-types';
import KanbanColumn from './KanbanColumn.vue';
import { Colors } from './KanbanColumnHeader.vue';

export interface Column<U extends { id: number }> {
  id: number;
  title: string;
  group: string;
  color: Colors;
  items: Droppable<U>[];
  accept?: ComponentProps<typeof KanbanColumn>['accept'];
  disable?: boolean;
}

type Slot<U> = {
  card(props: { item: U }): any;
};

defineSlots<Slot<Droppable<T>>>();

const columns = defineModel<Column<T>[]>({
  default: () => [],
});

const canDrag = ref(true);
const isDraggingItems = ref(false);
const modalDeleteColumn = ref(false);
const selectedDeleteGroup = ref<{ group: string; length: number } | null>(null);

const confirmDeleteI18n = computed(() => ({
  title: selectedDeleteGroup.value?.length
    ? 'No momento não é possível excluir esta coluna!'
    : 'Deseja realmente excluir essa coluna?',
  subtitle: selectedDeleteGroup.value?.length
    ? 'Para remover esta coluna é necessário que ela esteja vazia. Mova todas as tarefas para outra coluna para realizar essa ação.'
    : 'Esse processo é irreversível',
  cancel: selectedDeleteGroup.value?.length ? 'Entendi' : 'Cancelar',
}));

const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};

const handleTitleChange = (group: string, value: string) => {
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      column.title = value;
      column.group = `${value.trim().toLowerCase().replace(/ /g, '_')}_${column.id}`;
    }
    return column;
  });
};

const handleAddColumn = () => {
  const newId = Math.round(Math.random() * 10000);
  const emptyColumn: Column<T> = {
    id: newId,
    color: 'gray',
    group: `column-${newId}`,
    title: '',
    items: [],
  };
  columns.value = [...columns.value, emptyColumn];

  setTimeout(() => {
    document.querySelector<HTMLInputElement>(`#${columns.value.at(-1)?.group} input`)?.focus();
  }, 100);
};

const handleCancelColumn = (group: string) => {
  columns.value = columns.value.filter((column) => column.group !== group);
};

const handleConfirmDeleteColumn = (group: string) => {
  const deletedColumn = columns.value.find((column) => column.group === group);
  if (deletedColumn) {
    selectedDeleteGroup.value = {
      group,
      length: deletedColumn.items.length,
    };
    modalDeleteColumn.value = true;
  }
};

const handleDeleteColumn = () => {
  const group = selectedDeleteGroup.value?.group;
  const deletedColumn = columns.value.find((column) => column.group === group);
  if (!group || deletedColumn?.items.length) return;
  columns.value = columns.value.filter((v) => v.group !== group);
  selectedDeleteGroup.value = null;
  modalDeleteColumn.value = false;
};

const handleInsertCard = ({ group, newIndex }: { newIndex: number; value: Droppable<T>; group: string }) => {
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      return toRaw({
        ...column,
        items: column.items.map((item) => ({
          ...item,
          raw: {
            ...item.raw,
            position: newIndex,
            status: group,
          },
          group,
        })),
      });
    }
    return toRaw(column);
  });
};

const handleUpdateList = (items: Droppable<T>[], group: string) => {
  const updatedItems: Droppable<T>[] = items.map((item, index) => ({ ...item, raw: { ...item.raw, position: index } }));
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      return { ...column, items: updatedItems };
    }
    return column;
  });
};

const handleAddItem = (group: string, title: string) => {
  const newId = Math.round(Math.random() * 10000);
  const emptyItem = {
    id: newId,
    title,
    position: 0,
    status: group,
  } as T;
  const column = columns.value.find((column) => column.group === group);
  if (!column) {
    return;
  }
  columns.value = columns.value.map((oldColumn) => {
    if (column.id === oldColumn.id) {
      return { ...oldColumn, items: [...oldColumn.items, { group, raw: emptyItem }] };
    }
    return oldColumn;
  });
};

const handleSortStart = () => {
  isDraggingItems.value = true;
};

const handleSortEnd = () => {
  isDraggingItems.value = false;
};

defineExpose({ canDrag, setCanDrag });
// watch(columns, (value) => console.log(value));
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
          v-model="column['items']"
          class="tw-mr-2"
          :color="column.color"
          :group="column.group"
          :title="column.title"
          @add-item="(group, title) => handleAddItem(group, title)"
          @cancel-column="handleCancelColumn"
          @delete="handleConfirmDeleteColumn(column.group)"
          @insert-card="handleInsertCard"
          @sort-end="handleSortEnd"
          @sort-start="handleSortStart"
          @sort-move="canDrag = false"
          @title-column-change="handleTitleChange"
          @update-list="handleUpdateList"
        >
          <template #card="{ item }">
            <slot name="card" :item="item"></slot>
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
      :no-submit-button="!!selectedDeleteGroup?.length"
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
