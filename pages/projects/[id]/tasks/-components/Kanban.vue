<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { SlickItem, SlickList } from 'vue-slicksort';
import { generateGroup } from '~/utils';
import {
  BoardsResponse,
  useCreateKanban,
  useDeleteColumn,
  useGetKanban,
  useUpdateColumn,
} from '../-composables/useKanban';
import { Droppable, KanbanStatusType, SprintTask } from '../-types';
import KanbanAddColumn from './KanbanAddColumn.vue';
import KanbanColumn from './KanbanColumn.vue';
import { Colors } from './KanbanColumnHeader.vue';
import TaskCard from './TaskCard.vue';

export interface Column<U extends { id: number }> {
  id: number;
  title: string;
  group: string;
  position: number;
  items: Droppable<U>[];
  status_type: string;
  color?: Colors;
  disable?: boolean;
}
type Item = Droppable<TaskSimple>;
type KanbanProps = {
  sprint?: SprintTask;
};
const props = defineProps<KanbanProps>();
const sprintValue = toRef(props, 'sprint');
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const requiredStatusColumn = ['to_do', 'done'];
// Querys
const queryClient = useQueryClient();
const enabledKanban = computed(() => !!sprintValue.value);
const { data: kanban, isLoading, refetch: refetchKanban } = useGetKanban(learninplanId, sprintValue, enabledKanban);
const { mutateAsync: createKanban } = useCreateKanban();
const { mutateAsync: updateColumn } = useUpdateColumn();
const { mutateAsync: deleteColumn } = useDeleteColumn();

//  Refs
const canDrag = ref(true);
const isDraggingItems = ref(false);
const modalDeleteColumn = ref(false);
const selectedColumnToDelete = ref<Column<TaskSimple> | null>(null);

const getDeleteColumnTexts = (column: Column<TaskSimple> | null) => {
  if (requiredStatusColumn.includes(column?.status_type || '')) {
    return {
      title: 'No momento não é possível excluir esta coluna!',
      subtitle: 'Essa coluna é obrigatória, sendo assin só é possível editar sua posição e título.',
      cancel: 'Entendi',
    };
  }
  if (selectedColumnToDelete.value?.items.length) {
    return {
      title: 'No momento não é possível excluir esta coluna!',
      subtitle:
        'Para remover esta coluna é necessário que ela esteja vazia. Mova todas as tarefas para outra coluna para realizar essa ação.',
      cancel: 'Entendi',
    };
  }

  return {
    title: 'Realmente deseja excluir essa Coluna?',
    subtitle: 'Esse processo é irreversível.',
    cancel: 'Cancelar',
  };
};
// Computed
const confirmDeleteI18n = computed(() => getDeleteColumnTexts(selectedColumnToDelete.value));
const columns = computed<Column<TaskSimple>[]>({
  get: () =>
    kanban.value?.boards.map((column) => ({
      id: column.id,
      title: column.title,
      group: generateGroup(column.status_type, column.id),
      position: column.position,
      status_type: column.status_type,
      items: column.tasks.map((task) => ({ group: `${column.status_type}_${column.id}`, raw: task })),
    })) as Column<TaskSimple>[],
  set: (value) => {
    queryClient.setQueryData<BoardsResponse>(['kanban', learninplanId, sprintValue], (oldData) => {
      if (!oldData) {
        return;
      }
      return {
        ...oldData,
        boards: value.map(({ items, ...item }) => ({
          ...item,
          status_type: item.status_type as ValueOf<typeof KanbanStatusType>,
          tasks: items.map((item) => item.raw),
        })),
      };
    });
  },
});

// Methods
const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
const createNewKanbanVersion = async () => {
  if (!kanban.value?.isDefault || !sprintValue.value) {
    return;
  }
  await createKanban({
    columns: columns.value.map((column) => ({ title: column.title, position: column.position })),
    sprintId: sprintValue.value.id,
  });
  refetchKanban();
};
const handleTitleChange = async (group: string, value: string) => {
  const column = columns.value.find((column) => column.group === group);
  if (!column || column?.title === value.trim() || column.status_type === 'doing_local') {
    return;
  }
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      column.title = value;
    }
    return column;
  });
  await createNewKanbanVersion();
  updateColumn({ id: column.id, position: column.position, title: value });
};

const handleConfirmDeleteColumn = (group: string) => {
  const deletedColumn = columns.value.find((column) => column.group === group);
  if (deletedColumn) {
    selectedColumnToDelete.value = deletedColumn;
    modalDeleteColumn.value = true;
  }
};
const handleDeleteColumn = async () => {
  if (!selectedColumnToDelete.value || selectedColumnToDelete.value?.items.length) return;
  if (requiredStatusColumn.includes(selectedColumnToDelete.value.status_type)) return;
  await createNewKanbanVersion();
  selectedColumnToDelete.value =
    columns.value.find((column) => column.title === selectedColumnToDelete.value?.title) || null;
  if (!selectedColumnToDelete.value) {
    return;
  }
  await deleteColumn({ id: selectedColumnToDelete.value.id });
  selectedColumnToDelete.value = null;
  modalDeleteColumn.value = false;
  refetchKanban();
};
const handleInsertCard = ({ group, newIndex }: { newIndex: number; value: Droppable<TaskSimple>; group: string }) => {
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
const handleUpdateList = (items: Item[], group: string) => {
  const updatedItems: Item[] = items.map((item, index) => ({ ...item, raw: { ...item.raw, position: index } }));
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
  } as TaskSimple;
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
const getMembers = (taskMembers?: TaskMember[]) => {
  return (
    taskMembers?.map((member) => ({
      name: member.learning_plan_member?.user?.fullname || '',
      ...(member.learning_plan_member?.user?.avatar?.url && {
        image: {
          url: member.learning_plan_member?.user?.avatar?.url,
        },
      }),
    })) || []
  );
};
defineExpose({ canDrag, setCanDrag });
// watch(columns, (value) => console.log(value));
</script>

<template>
  <div class="tw-flex-grow">
    <div v-if="!sprint">Nenhuma sprint selecionada</div>
    <template v-else>
      <div v-if="isLoading" class="tw-flex tw-h-full tw-items-center tw-justify-center">
        <v-progress-circular color="accent" indeterminate :size="40" :width="6"></v-progress-circular>
      </div>
      <SlickList
        v-else
        v-model:list="columns"
        use-drag-handle
        use-window-as-scroll-container
        axis="x"
        class="tw-w-full tw-flex tw-flex-grow tw-overflow-x-auto tw-overflow-y-hidden bg-white tw-rounded-lg tw-relative tw-select-none"
        :distance="15"
      >
        <!-- :disabled="fixedColumns.includes(column.status_type)" erro na biblioteca -->
        <SlickItem v-for="(column, i) in columns" :key="column.id" :index="i">
          <KanbanColumn
            :key="column.group"
            v-model="column['items']"
            class="tw-mr-2"
            :color="column.color"
            :group="column.group"
            :title="column.title"
            @add-item="(group, title) => handleAddItem(group, title)"
            @delete="handleConfirmDeleteColumn(column.group)"
            @insert-card="handleInsertCard"
            @sort-end="handleSortEnd"
            @sort-start="handleSortStart"
            @sort-move="canDrag = false"
            @title-column-change="handleTitleChange"
            @update-list="handleUpdateList"
          >
            <template #card="{ item }">
              <TaskCard
                :date="item.raw.finish_at ? new Date(item.raw.finish_at) : undefined"
                :name="item.raw.title"
                :tags="item.raw.tags"
                :participants="getMembers(item.raw?.task_members)"
              />
            </template>
          </KanbanColumn>
        </SlickItem>
        <KanbanAddColumn :kanban="kanban" :columns-length="columns.length" @add-column="refetchKanban()" />
      </SlickList>
      <alex-custom-confirm-dialog
        v-model="modalDeleteColumn"
        no-input-confirmation
        submit-button-text="Excluir"
        variant="error"
        :cancel-button-text="confirmDeleteI18n.cancel"
        :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
        :no-submit-button="
          requiredStatusColumn.includes(selectedColumnToDelete?.status_type || 'doing') ||
          !!selectedColumnToDelete?.items.length
        "
        :subtitle="confirmDeleteI18n.subtitle"
        :title="confirmDeleteI18n.title"
        @cancel="modalDeleteColumn = false"
        @submit="handleDeleteColumn"
      />
    </template>
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
