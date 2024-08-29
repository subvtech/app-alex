<template>
  <Transition
    v-for="(sprint, index) in sprints"
    :key="sprint.raw.id"
    name="slide"
  >
    <v-expansion-panels
      v-model="sprint.expanded"
      class="task-accordion my-6 rounded-lg"
    >
      <v-expansion-panel class="rounded-lg">
        <v-expansion-panel-title class="cursor-default" disabled hide-actions>
          <v-icon
            :icon="sprint.expanded ? 'mdi-chevron-down' : 'mdi-chevron-up'"
            @click="toggleExpandSprint(sprint.raw.id)"
          />
          <span class="text-h5 text-gray-800">{{ sprint.raw.name }}</span>
          <div class="tw-flex tw-gap-2 text-gray-600">
            <p>{{ getSprintDates(sprint.raw) }}</p>
          </div>
          <alex-custom-chip
            status="secondary"
            size="small"
            :text="sprint.raw.tasks.length.toString()"
          />
          <alex-custom-button class="ml-auto" icon="mdi-plus" variant="text" />
          <alex-custom-button icon="mdi-dots-vertical" variant="text" />
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <Transition :name="slideTransition(index)" mode="out-in">
            <div v-if="!sprint.raw.tasks.length && !sprint.expanded">
              <alex-learningplan-task-empty-state
                key="empty-state"
                type="sprint"
                :message="`Nenhuma tarefa em ${sprint.raw.name}`"
                :index="index"
                :drop-area="dragDrop.over.value.list === sprint.group"
                @drag-over="
                  (event) => handleEmptyStateOver(sprint, index, event)
                "
                @drag-leave="dragDrop.onDragLeave"
              />
            </div>
            <div v-else>
              <alex-learningplan-task-project-table
                key="table"
                :tasks="sprint.raw.tasks"
                :sprints="sprintGroups"
                :search="search"
                :active-filter="activeFilter"
                :group="sprint.group"
                :over="setOver(sprint.group)"
                :drag-from="dragDrop.dragFrom.value"
                :dragging="dragDrop.dragging.value"
                @start-drag="dragDrop.startDrag"
                @drag-over="dragDrop.onDragOver"
                @drag-leave="dragDrop.onDragLeave"
                @drag-end="(item, sort) => $emit('drag-end', item, sort)"
                @delete-task="(item) => $emit('delete-task', item)"
                @move-task="(item) => $emit('move-task', item)"
                @edit-task="(item) => $emit('edit-task', item)"
              />
            </div>
          </Transition>
          <div class="mb-4">
            <Transition mode="out-in" name="add-task">
              <alex-custom-button
                v-if="index !== isCreatingTask"
                size="large"
                variant="text"
                prepend-icon="mdi-plus"
                class="w-100 create-task-btn"
                :loading="isPending && index === isCreatingTask"
                @click="handleStartCreateTask(index)"
              >
                {{ $t('pages.task.add') }}
              </alex-custom-button>
              <div v-else class="d-flex ga-2">
                <alex-inputs-text-field
                  v-model="taskTitle"
                  autofocus
                  :placeholder="$t('pages.task.addPlaceholder')"
                  class="w-100"
                  density="comfortable"
                  name="taskTitle"
                  hide-details
                  :disabled="isPending"
                  @keyup.enter="
                    createTask({
                      title: taskTitle,
                      position: getHigherIndex(sprint.raw),
                      learningPlanId,
                    })
                  "
                />
                <alex-custom-button
                  size="large"
                  :loading="isPending"
                  @click="
                    createTask({
                      title: taskTitle,
                      position: getHigherIndex(sprint.raw),
                      learningPlanId,
                    })
                  "
                >
                  {{ $t('pages.task.addButton') }}
                </alex-custom-button>
              </div>
            </Transition>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </Transition>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import ptBR from 'date-fns/locale/pt-BR';
// eslint-disable-next-line import/no-duplicates
import enUS from 'date-fns/locale/en-US';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
import { TaskItem } from './List.vue';
import { useCreateTask } from './mutations';
export interface PanelItem<T> {
  group: string;
  expanded: 0 | 1;
  raw: T;
}
export interface Sprint {
  id: number;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  tasks: TaskItem[];
}
interface DragDrop {
  over: Ref<{
    list: string;
    id: number;
    index: number;
    position?: ('top' | 'bottom') | undefined;
  }>;
  dragFrom: Ref<number>;
  dragging: Ref<boolean>;
  startDrag: (
    id: number,
    e: DragEvent,
    dropTo?: string[],
    dragGhost?: string,
  ) => void;
  dragEnd: () => void;
  onDragOver: (list: string, id: number, index: number, e: DragEvent) => void;
  onDragLeave: (event: DragEvent) => boolean;
}
interface SprintProps {
  learningPlanId: number;
  search: string;
  activeFilter?: boolean;
}
withDefaults(defineProps<SprintProps>(), { activeFilter: false });
type Emit = {
  'move-task': [item: TaskItem];
  'delete-task': [item: TaskItem];
  'edit-task': [item: TaskItem];
  'drag-end': [item: TaskItem, sort: string];
};
defineEmits<Emit>();
const dragDrop = defineModel<DragDrop>('dragDrop', { required: true });
const sprints = defineModel<PanelItem<Sprint>[]>({ default: [] });
const isCreatingTask = ref<number | null>(null);
const { mutateAsync: createTask, isPending } = useCreateTask();
const taskTitle = ref('');
const { locale } = useI18n();

//
const sprintGroups = computed(() =>
  sprints.value.map((sprint) => sprint.group),
);
// Functions
const toggleExpandSprint = (id: number) => {
  isCreatingTask.value = null;
  taskTitle.value = '';
  sprints.value = sprints.value.map((sprint) => {
    if (sprint.raw.id === id) {
      return {
        ...sprint,
        expanded: !sprint.expanded ? 1 : 0,
      };
    }
    return sprint;
  });
};
const slideTransition = (i: number) =>
  sprints.value[i].raw.tasks.length ? 'slide-down' : 'slide-up';
const setOver = (group: string) => {
  if (dragDrop.value.over.value.list === group)
    return dragDrop.value.over.value;
  return { ...dragDrop.value.over.value, id: -1 };
};
const formattDate = (date: Date) =>
  format(date, 'dd MMM', { locale: locale.value === 'pt' ? ptBR : enUS });
const getHigherIndex = (sprint: Sprint) => {
  return sprint[sprint.tasks.length - 1].position + 1;
};
const getSprintDates = (sprint: Sprint) => {
  return `${formattDate(new Date(sprint.startDate))} - ${formattDate(
    new Date(sprint.startDate),
  )}`;
};
const handleEmptyStateOver = (
  item: PanelItem<Sprint>,
  index: number,
  dragEvent: DragEvent,
) => {
  dragDrop.value.onDragOver(item.group, -index, -1, dragEvent);
};
const handleStartCreateTask = (index: number) => {
  taskTitle.value = '';
  isCreatingTask.value = index;
};
</script>

<style scoped></style>
