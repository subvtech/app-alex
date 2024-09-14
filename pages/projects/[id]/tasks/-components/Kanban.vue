<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query';
import { SlickItem, SlickList } from 'vue-slicksort';
import { generateGroup } from '~/utils';
import { useCreateKanbanTask } from '../-composables/useCreateTask';
import {
  BoardsResponse,
  useCreateKanban,
  useDeleteColumn,
  useGetKanban,
  useReorderColumns,
  useReorderColumnTasks,
  useUpdateColumn,
} from '../-composables/useKanban';
import { Droppable, KanbanColumnTask, KanbanStatusType, SprintTask } from '../-types';
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
  status_type: ValueOf<typeof KanbanStatusType>;
  color?: Colors;
  disable?: boolean;
}
type Item = Droppable<KanbanColumnTask>;
type KanbanProps = {
  sprint?: SprintTask;
};
const { t } = useI18n();
const props = defineProps<KanbanProps>();
const selectedSprint = toRef(props, 'sprint');
const route = useRoute();
const learninplanId = computed(() => parseInt(route.params.id.toString()));
const requiredStatusColumn = ['to_do', 'done'];
// Querys
const queryClient = useQueryClient();
const enabledKanban = computed(() => !!selectedSprint.value);
const { data: kanban, isLoading, refetch: refetchKanban } = useGetKanban(learninplanId, selectedSprint, enabledKanban);
const { mutateAsync: createKanban } = useCreateKanban();
const { mutateAsync: updateColumn } = useUpdateColumn();
const { mutateAsync: deleteColumn } = useDeleteColumn();
const { mutateAsync: reorderColumns } = useReorderColumns();
const { mutateAsync: createTask } = useCreateKanbanTask(learninplanId, queryClient);
const { mutateAsync: reorderTasks } = useReorderColumnTasks();
//  Refs
const canDrag = ref(true);
const isDraggingItems = ref(false);
const modalDeleteColumn = ref(false);
const selectedColumnToDelete = ref<Column<KanbanColumnTask> | null>(null);

const getDeleteColumnTexts = (column: Column<KanbanColumnTask> | null) => {
  if (requiredStatusColumn.includes(column?.status_type || '')) {
    return {
      title: t('pages.projects.tasks.column_move_has_tasks'),
      subtitle: t('pages.projects.tasks.required_column'),
      cancel: t('pages.projects.tasks.delete_column_cancel_text'),
    };
  }
  if (selectedColumnToDelete.value?.items.length) {
    return {
      title: t('pages.projects.tasks.column_move_has_tasks'),
      subtitle: t('pages.projects.tasks.delete_column_has_tasks_subtitle'),
      cancel: t('pages.projects.tasks.delete_column_cancel_text'),
    };
  }

  return {
    title: t('pages.projects.tasks.confirm_delete_column'),
    subtitle: t('pages.projects.tasks.irreversible_process'),
    cancel: t('pages.projects.tasks.cancel'),
  };
};
// Computed
const confirmDeleteI18n = computed(() => getDeleteColumnTexts(selectedColumnToDelete.value));
const columns = computed<Column<KanbanColumnTask>[]>({
  get: () =>
    kanban.value?.boards
      .map((column) => ({
        id: column.id,
        title: column.title,
        group: generateGroup(column.status_type, column.id),
        position: column.position,
        status_type: column.status_type,
        items: column.tasks.map((task) => ({
          id: task.id,
          group: `${column.status_type}_${column.id}`,
          raw: task,
        })),
      }))
      .sort((a, b) => a.position - b.position) || [],
  set: (value) => {
    queryClient.setQueryData<BoardsResponse>(['kanban', learninplanId, selectedSprint], (oldData) => {
      if (!oldData) {
        return;
      }
      return {
        ...oldData,
        boards: value.map(({ items, ...item }) => ({
          ...item,
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
  if (!kanban.value?.isDefault || !selectedSprint.value) {
    return;
  }
  await createKanban({
    columns: columns.value.map((column) => ({ title: column.title, position: column.position })),
    sprintId: selectedSprint.value.id,
  });
  refetchKanban();
};
const handleTitleChange = async (group: string, value: string) => {
  const column = columns.value.find((column) => column.group === group);
  if (!column || column?.title === value.trim()) {
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
const handleInsertCard = ({
  group,
  newIndex,
}: {
  newIndex: number;
  value: Droppable<KanbanColumnTask>;
  group: string;
}) => {
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      return toRaw({
        ...column,
        items: column.items.map((item) => ({
          ...item,
          raw: {
            ...item.raw,
            vertical_position: newIndex,
            status: group,
          },
          group,
        })),
      });
    }
    return toRaw(column);
  });
};
const handleUpdateListItems = async (items: Item[], columnId: number, group: string) => {
  if (!kanban.value) {
    return;
  }
  const updatedItems: Item[] = items.map((item, index) => ({
    ...item,
    raw: { ...item.raw, vertical_position: index },
  }));
  columns.value = columns.value.map((column) => {
    if (column.group === group) {
      return { ...column, items: updatedItems };
    }
    return column;
  });

  const tasks = updatedItems.map((item) => ({ id: item.raw.id, vertical_position: item.raw.vertical_position }));
  await reorderTasks({ kanbanId: kanban.value.id, columns: [{ id: columnId, tasks }] });
  refetchKanban();
};
const handleUpdateList = async (updatedColumns: Column<KanbanColumnTask>[]) => {
  const updated = updatedColumns.map((column, index) => {
    if (requiredStatusColumn.includes(column.status_type)) {
      return column;
    }
    return { ...column, position: index === 0 ? 1 : index + 1 };
  });
  columns.value = updated.sort((a, b) => a.position - b.position);
  if (!kanban.value) return;
  await reorderColumns({
    kanbanId: kanban.value.id,
    columns: columns.value,
  });
};

const handleAddItem = async (columnId: number, _group: string, title: string) => {
  if (!selectedSprint.value) {
    return;
  }
  const lastIndex = columns.value.find((column) => column.id === columnId)?.items.length || 0;
  await createTask({
    kanbanColumnId: columnId,
    learningPlanId: learninplanId.value,
    organization: 'standard',
    position: lastIndex,
    sprintId: selectedSprint.value?.id,
    title,
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
        @update:list="handleUpdateList"
      >
        <SlickItem v-for="(column, i) in columns" :key="column.id" :index="i">
          <KanbanColumn
            v-model="column['items']"
            class="tw-mr-2"
            :column-id="column.id"
            :color="column.color"
            :group="column.group"
            :title="column.title"
            @delete="handleConfirmDeleteColumn(column.group)"
            @insert-card="handleInsertCard"
            @sort-end="handleSortEnd"
            @sort-start="handleSortStart"
            @sort-move="canDrag = false"
            @add-item="handleAddItem"
            @title-column-change="handleTitleChange"
            @update-list="handleUpdateListItems"
          >
            <template #card="{ item }">
              <TaskCard
                :date="item.raw.task.finish_at ? new Date(item.raw.task.finish_at) : undefined"
                :name="item.raw.task.title"
                :tags="item.raw.task.tags"
                :participants="getMembers(item.raw?.task.task_members)"
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
