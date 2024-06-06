<template>
  <div class="mt-8 bg-white rounded-lg relative">
    <!-- Inputs -->
    <div
      class="d-flex align-center pa-3 px-6 ga-3 border-bottom-1 border-gray-100"
    >
      <alex-inputs-text-field
        name="student"
        :placeholder="$t('components.courses.tasks.srchStudent')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="w-full mr-auto min-w-40 max-w-80"
        density="comfortable"
      />
      <!-- Deixar filtrar funcional -->
      <v-tooltip text="Filtrar" location="bottom" content-class="bg-gray-800">
        <template #activator="{ props: propsFilter }">
          <alex-custom-button
            v-bind="propsFilter"
            icon="mdi-filter-variant"
            size="large"
            variant="secondary"
            @click="handleFilter"
          />
        </template>
      </v-tooltip>
    </div>

    <v-slide-y-transition>
      <div
        v-if="filters.select.value || filters.finalDate.value"
        class="flex gap-2 px-6 pt-4"
      >
        <template v-for="(filter, key) in filters" :key="filter.title">
          <alex-custom-chip
            v-if="filter.value"
            :text="filter.title"
            status="secondary"
            clickable
            closable
            @click:close="() => handleRemoveFilter(key)"
          />
        </template>
      </div>
    </v-slide-y-transition>
    <!-- Categorias e seus respectivos alunos -->
    <div
      ref="kanban"
      class="w-full flex gap-4 pa-6 overflow-x-auto overflow-y-hidden"
    >
      <alex-learningplan-task-kanban-column
        v-for="(column, index) in columns"
        :key="index"
        v-model="columnsTasks[column.group]"
        :title="column.title"
        :color="column.color"
        :group="column.group"
        :accept="column.accept"
        @click:card="$emit('card-click')"
        @insert-card="handleInsertCard"
      >
        <template #card="{ item, status }">
          <template v-if="type === 'professor'">
            <alex-learningplan-task-card
              v-if="!isTaskStudent(item)"
              class="kanban-card-item-inner mt-2 select-none"
              :date="item.date"
              :name="item.user.name"
              :student-class="item.studentClass"
              :status="status"
              :avatar="item?.user.avatar"
              :mark="item.mark"
              :max-mark="item.maxMark"
            />
          </template>
          <template v-if="type === 'student'">
            <alex-learningplan-task-student-card
              v-if="isTaskStudent(item)"
              class="kanban-card-item-inner mt-2 select-none"
              :title="item.title"
              :date="item.date"
              :group="item.group"
              :name-group="item.nameGroup"
              :status="status"
              :avatar="item?.avatar"
              :mark="item.mark"
              :max-mark="item.maxMark"
            />
          </template>
        </template>
      </alex-learningplan-task-kanban-column>
    </div>
    <alex-learningplan-task-drawer-filter
      ref="filterRef"
      v-model="filterDrawer"
      :classes="classes"
      @filter="applyFilters"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends 'professor' | 'student'">
import { isWithinInterval } from 'date-fns';
import { useMouse } from '@vueuse/core';
import { Accept } from './column/index.vue';
import { TaskStatus } from '~/models/simple/taskSimple.model';
// Types
export interface Task {
  id: number;
  status: TaskStatus | (string & {});
  date: Date;
  studentClass: string;
  user: { name: string; avatar?: string | null };
  mark?: number;
  maxMark?: number;
}
export interface TaskStudent {
  id: number;
  date: Date;
  status: TaskStatus | (string & {});
  title: string;
  group?: boolean;
  nameGroup?: string;
  avatar?: string | null;
  mark?: number;
  maxMark?: number;
}
type Colors = 'orange' | 'green' | 'blue' | 'gray';
type KanbanType = 'professor' | 'student';
type Card<T extends KanbanType> = T extends 'professor' ? Task : TaskStudent;
interface Column<T extends KanbanType> {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<Card<T>> | null;
}
interface KanbanProps {
  type: T;
  classes?: string[];
}
const { t } = useI18n();
// Models/props
const props = defineProps<KanbanProps>();
const tasks = defineModel<Card<typeof props.type>[]>({
  required: true,
});
const columns = defineModel<Column<typeof props.type>[]>('columns', {
  required: true,
});

const columnsTasks = computed(() =>
  columns.value.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = filteredByFinalDate.value.filter(
        (task) => item.group === task.status,
      );
    }
    return acc;
  }, {}),
);

type Emits = {
  (e: 'filter-click'): void;
  (e: 'card-click'): void;
  (
    e: 'card-insert',
    newIndex: number,
    value: Card<typeof props.type>,
    group: string,
  ): Promise<boolean>;
};
const emit = defineEmits<Emits>();

const handleInsertCard = ({ newIndex, value, group }) => {
  // Update task status
  if (value) {
    tasks.value = tasks.value.map((task) => {
      if (task.id === value.id) {
        return { ...task, status: group };
      }
      return task;
    });
  }
  emit('card-insert', newIndex, value, group);
};
const isTaskStudent = (card: Task | TaskStudent): card is TaskStudent => {
  return 'title' in card;
};

// Filter
type Filters = {
  select: string;
  finalDate: { start: string; end: string };
};
type FiltersValue = {
  select: {
    title: string;
    value: string | null;
  };
  finalDate: {
    title: string;
    value: { start: string; end: string } | null;
  };
};
const filterTitleSelect = computed(() => {
  const drawer = 'components.learningPlan.drawer';
  return props.classes?.length ? t(`${drawer}.class`) : t(`${drawer}.type`);
});
const filterRef = ref<{ removeFilter: (key: string) => void } | null>(null);
const filterDrawer = ref(false);
const filters = ref<FiltersValue>({
  select: {
    title: filterTitleSelect.value,
    value: null,
  },
  finalDate: {
    title: t('components.learningPlan.drawer.finalDate'),
    value: null,
  },
});
const handleFilter = () => {
  filterDrawer.value = true;
};

const handleRemoveFilter = (key: string) => {
  filters.value[key].value = null;
  if (filterRef.value) {
    filterRef.value.removeFilter(key);
  }
};

const applyFilters = (values: Filters) => {
  if (values.select) {
    filters.value.select.value = values.select;
  }
  if (values.finalDate) {
    filters.value.finalDate.value = values.finalDate;
  }
};

const filteredByClassTasks = computed(() =>
  !filters.value.select.value
    ? tasks.value
    : filterByClassOrType(
        props.type === 'student',
        tasks.value,
        filters.value.select.value,
      ),
);

const filteredByFinalDate = computed(() => {
  if (filters.value.finalDate.value) {
    return filteredByClassTasks.value.filter((task) =>
      checkIntervalOfDates(
        task.date,
        filters.value.finalDate.value!.start,
        filters.value.finalDate.value!.end,
      ),
    );
  }
  return filteredByClassTasks.value;
});

const checkIntervalOfDates = (initial: Date, first: string, second: string) =>
  isWithinInterval(initial, {
    start: new Date(first.replaceAll('-', '/')),
    end: new Date(second.replaceAll('-', '/')).setHours(23, 59, 59),
  });

const filterByClassOrType = (
  isStudent: boolean,
  tasks: Card<T>[],
  value: string,
) => {
  if (!isStudent) {
    return tasks.filter((task) => (task as Task).studentClass === value);
  }
  return tasks.filter(
    (task) => (task as TaskStudent).group === (value === 'group'),
  );
};

// Scroll X and Y
const kanban = ref<HTMLDivElement | null>(null);
const { x: mouseX, y: mouseY } = useMouse({ window, type: 'client' });
const moveViewX = () => {
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  if (!kanban.value || !isDragging) return;
  const rect = kanban.value.getBoundingClientRect();
  const x = mouseX.value - rect.left;
  const padding = 20;
  if (x < padding) {
    kanban.value.scrollLeft -= 10;
  }
  if (x > rect.width - padding) {
    kanban.value.scrollLeft += 10;
  }
};
const moveViewY = () => {
  const isDragging = document.querySelector('.kanban-card-item.kanban-helper');
  const html = document.querySelector('html');
  if (!isDragging || !html) return;
  const y = Math.abs(mouseY.value);
  const paddingTop = 0.22;
  const paddingBottom = 0.68;
  if (y < window.innerHeight * paddingTop) {
    html.scrollTop -= 8;
  }
  if (y > window.innerHeight * paddingBottom) {
    html.scrollTop += 8;
  }
};
watch(mouseX, moveViewX);
watch(mouseY, moveViewY);
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
