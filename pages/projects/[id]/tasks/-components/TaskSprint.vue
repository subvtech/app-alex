<script setup lang="ts">
import { format } from 'date-fns/esm';
import { enUS, ptBR } from 'date-fns/locale';
import { useCreateTask } from '../-composables/useCreateTask';
import { Droppable, SprintTask } from '../-types';
import TaskTable from './TaskTable.vue';

export interface Sprint {
  id: number;
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  tasks: SprintTask[];
}

interface DropdownItem {
  text: string;
  warning?: boolean;
  onClick: () => void;
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
  startDrag(id: number, evt: DragEvent, dropTo?: string[], dragGhost?: string): void;
  dragEnd(): void;
  onDragLeave(event: DragEvent): boolean;
  onDragOver(list: string, id: number, index: number, e: DragEvent): void;
}

interface SprintProps {
  activeFilter?: boolean;
  editSprints: DropdownItem[];
  learningPlanId: number;
  search: string;
}

const props = withDefaults(defineProps<SprintProps>(), { activeFilter: false });

defineEmits<{
  'move-task': [item: SprintTask];
  'move-to-backlog': [item: SprintTask];
  'delete-task': [item: SprintTask];
  'edit-task': [item: SprintTask];
  'drag-end': [item: SprintTask, sort: string];
}>();

const dragDrop = defineModel<DragDrop>('dragDrop', { required: true });
const sprints = defineModel<Droppable<Sprint>[]>({ default: [] });
const isCreatingTask = ref<number | null>(null);
const { mutateAsync: createTask, isPending } = useCreateTask();
const taskTitle = ref('');
const { locale } = useI18n();

const sprintGroups = computed(() => sprints.value.map((sprint) => sprint.group));

const formatDate = (date: Date) => {
  return format(date, 'dd MMM', { locale: locale.value === 'pt' ? ptBR : enUS });
};

const getDropdownItems = (index: number): DropdownItem[] => {
  const moveSprint = (index: number, position: 'up' | 'down') => {
    console.log(index, position);
  };

  const items = [
    {
      text: 'Editar',
      onClick: () => console.log('Editar'),
    },
    index !== 0 && {
      text: 'Mover para cima',
      onClick: () => moveSprint(index, 'up'),
    },
    index !== sprints.value.length - 1 && {
      text: 'Mover para baixo',
      onClick: () => moveSprint(index, 'down'),
    },
    // TODO: Verificar se tem entregas
    {
      text: 'Excluir',
      warning: true,
      onClick: () => console.log('Excluir'),
    },
  ];

  return items.filter(Boolean) as DropdownItem[];
};

const getHigherIndex = (sprint: Sprint) => {
  return sprint[sprint.tasks.length - 1].position + 1;
};

const getSlideTransition = (idx: number) => {
  return sprints.value[idx].raw.tasks.length ? 'slide-down' : 'slide-up';
};

const getSprintDates = (sprint: Sprint) => {
  return `${formatDate(new Date(sprint.startDate))} - ${formatDate(new Date(sprint.startDate))}`;
};

const toggleExpandSprint = (id: number) => {
  isCreatingTask.value = null;
  taskTitle.value = '';
  sprints.value = sprints.value.map((sprint) => {
    return sprint.raw.id === id ? { ...sprint, expanded: sprint.expanded ? 0 : 1 } : sprint;
  });
};

const handleAddTask = (sprint: Sprint) => {
  createTask({
    learningPlanId: props.learningPlanId,
    position: getHigherIndex(sprint),
    title: taskTitle.value,
  });
};

const handleEmptyStateOver = (item: Droppable<Sprint>, index: number, dragEvent: DragEvent) => {
  dragDrop.value.onDragOver(item.group, -index, -1, dragEvent);
};

const handleStartCreateTask = (index: number) => {
  taskTitle.value = '';
  isCreatingTask.value = index;
};
</script>

<template>
  <div>
    <Transition v-for="(sprint, index) in sprints" :key="sprint.raw.id" name="slide">
      <v-expansion-panels v-model="sprint.expanded" class="task-accordion my-6 rounded-lg">
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
            <alex-custom-chip status="secondary" size="small" :text="sprint.raw.tasks.length.toString()" />
            <div class="ml-auto">
              <alex-custom-dropdown :items="getDropdownItems(index)" icon="mdi-plus" variant="text" />
            </div>
            <alex-custom-dropdown :items="getDropdownItems(index)" icon="mdi-dots-vertical" variant="text" />
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Transition :name="getSlideTransition(index)" mode="out-in">
              <div v-if="!sprint.raw.tasks.length && !sprint.expanded">
                <alex-learningplan-task-empty-state
                  key="empty-state"
                  type="sprint"
                  :message="`Nenhuma tarefa em ${sprint.raw.name}`"
                  :index="index"
                  :drop-area="dragDrop.over.value.list === sprint.group"
                  @drag-over="(event) => handleEmptyStateOver(sprint, index, event)"
                  @drag-leave="dragDrop.onDragLeave"
                />
              </div>
              <div v-else>
                <TaskTable
                  key="table"
                  :active-filter="activeFilter"
                  :group="sprint.group"
                  :is-project="true"
                  :search="search"
                  :sprints="sprintGroups"
                  :tasks="sprint.raw.tasks"
                  @delete-task="$emit('delete-task', $event)"
                  @edit-task="$emit('edit-task', $event)"
                  @move-task="$emit('move-task', $event)"
                  @move-to-backlog="$emit('move-to-backlog', $event)"
                />
              </div>
            </Transition>
            <div class="mb-4">
              <Transition mode="out-in" name="add-task">
                <alex-custom-button
                  v-if="index !== isCreatingTask"
                  class="w-100 create-task-btn"
                  prepend-icon="mdi-plus"
                  size="large"
                  variant="text"
                  :loading="isPending && index === isCreatingTask"
                  @click="handleStartCreateTask(index)"
                >
                  {{ $t('pages.projects.tasks.add') }}
                </alex-custom-button>
                <div v-else class="d-flex ga-2">
                  <alex-inputs-text-field
                    v-model="taskTitle"
                    autofocus
                    hide-details
                    class="w-100"
                    density="comfortable"
                    name="taskTitle"
                    :disabled="isPending"
                    :placeholder="$t('pages.projects.tasks.add_placeholder')"
                    @keyup.enter="handleAddTask(sprint.raw)"
                  />
                  <alex-custom-button size="large" :loading="isPending" @click="handleAddTask(sprint.raw)">
                    {{ $t('pages.projects.tasks.add_button') }}
                  </alex-custom-button>
                </div>
              </Transition>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </Transition>
  </div>
</template>
