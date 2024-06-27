<template>
  <div class="tw-mt-8 bg-white tw-rounded-lg tw-relative">
    <!-- Inputs -->
    <div
      class="d-flex tw-align-center pa-3 tw-px-6 ga-3 border-bottom-1 border-gray-100"
    >
      <alex-inputs-text-field
        v-model="search"
        name="student"
        :placeholder="$t('components.courses.tasks.srchStudent')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        class="tw-w-full tw-mr-auto tw-min-w-40 tw-max-w-80"
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
        class="tw-flex gap-2 tw-px-6 tw-pt-4"
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
      class="tw-w-full tw-flex tw-gap-4 pa-6 tw-overflow-x-auto tw-overflow-y-hidden"
    >
      <alex-learningplan-task-kanban-column
        v-for="(column, index) in columns"
        :key="index"
        v-model="columnsTasks[column.group]"
        :title="column.title"
        :color="column.color"
        :group="column.group"
        :accept="column.accept"
        :disabled="!canDrag || column.disable"
        @insert-card="handleInsertCard"
      >
        <template #card="{ item, status, index: itemIndex }">
          <alex-learningplan-task-card
            v-if="!isTaskStudent(item)"
            class="kanban-card-item-inner select-none"
            :date="item.date"
            :name="item.user.name"
            :student-class="item.studentClass"
            :status="status"
            :avatar="item?.user.avatar"
            :mark="item.mark"
            :max-mark="item.maxMark"
            @click="$emit('card-click', itemIndex, item)"
          />
          <alex-learningplan-task-student-card
            v-else
            class="kanban-card-item-inner select-none"
            :title="item.title"
            :date="item.date"
            :group="item.group"
            :name-group="item.nameGroup"
            :status="status"
            :avatar="item?.avatar"
            :mark="item.mark"
            :max-mark="item.maxMark"
            @click="$emit('card-click', itemIndex, item)"
          />
        </template>
      </alex-learningplan-task-kanban-column>
    </div>
    <alex-learningplan-task-drawer-filter
      ref="filterRef"
      v-model="filterDrawer"
      kanban-filter
      :classes="classes"
      @filter="applyFilters"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends 'professor' | 'student'">
import { isWithinInterval, isBefore, isAfter, isEqual } from 'date-fns';
import { useMouse } from '@vueuse/core';
import { Accept } from './column/index.vue';
import {
  TaskMemberStatus,
  TaskSimple,
  TaskStatus,
} from '~/models/simple/taskSimple.model';
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
  status: TaskMemberStatus;
  title: string;
  group?: boolean;
  nameGroup?: string;
  avatar?: string | null;
  mark?: number;
  maxMark?: number;
  task?: TaskSimple;
}

export interface InsertCardProps {
  newIndex: number;
  value: any; // TaskStudent Problema com o export
  group: string;
}

type Colors = 'orange' | 'green' | 'blue' | 'gray';
type KanbanType = 'professor' | 'student';
type Card<T extends KanbanType> = T extends 'professor' ? Task : TaskStudent;
interface Column<T extends KanbanType> {
  title: string;
  group: string;
  color: Colors;
  accept?: Accept<Card<T>> | null;
  disable?: boolean;
}
interface KanbanProps {
  type: T;
  classes?: string[];
}

const { t } = useI18n();
// Models/props
const canDrag = ref(true);
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
  (e: 'card-click', index: number, item: Card<T>): void;
  (
    e: 'card-insert',
    newIndex: number,
    value: Card<typeof props.type> | TaskStudent,
    group: string,
  ): Promise<boolean>;
};
const emit = defineEmits<Emits>();

const handleInsertCard = ({ newIndex, value, group }: InsertCardProps) => {
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
const search = ref('');
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
const filteredBySearch = computed(() => {
  const searchValue = search.value.toLowerCase();
  return tasks.value.filter((task) => {
    if (isTaskStudent(task)) {
      return task.title.toLowerCase().includes(searchValue);
    }
    return task.user.name.toLowerCase().includes(searchValue);
  });
});
const filteredByClassTasks = computed(() =>
  !filters.value.select.value
    ? filteredBySearch.value
    : filterByClassOrType(
        props.type === 'student',
        filteredBySearch.value,
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

const checkIntervalOfDates = (
  initial: Date,
  first?: string,
  second?: string,
) => {
  if (!first && !second) {
    return true;
  }
  if (first && second) {
    return isWithinInterval(initial, {
      start: new Date(first.replaceAll('-', '/')),
      end: new Date(second.replaceAll('-', '/')).setHours(23, 59, 59),
    });
  }
  if (first) {
    const firstDate = new Date(first.replaceAll('-', '/'));
    return isAfter(initial, firstDate) || isEqual(initial, firstDate);
  }
  if (second) {
    const secondDate = new Date(second.replaceAll('-', '/')).setHours(
      23,
      59,
      59,
    );
    return isBefore(initial, secondDate) || isEqual(initial, secondDate);
  }
};

const filterByClassOrType = (
  isStudent: boolean,
  tasks: Card<T>[],
  value: string,
) => {
  if (!isStudent) {
    return tasks.filter((task) => (task as Task).studentClass === value);
  }
  return tasks.filter((task) => {
    const taskStudent = task as TaskStudent;
    if (value === 'individual' && !taskStudent.group) {
      return true;
    }
    if (value === 'group' && taskStudent.group) {
      return true;
    }
    return false;
  });
};

// Scroll X and Y
const kanban = ref<HTMLDivElement | null>(null);
const { x: mouseX, y: mouseY } = useMouse({ window, type: 'client' });
const moveViewX = () => {
  const isDragging = document.querySelector(
    '.kanban-card-item.kanban-card-dragging',
  );
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
  const isDragging = document.querySelector(
    '.kanban-card-item.kanban-card-dragging',
  );
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

const setCanDrag = (value: boolean) => {
  canDrag.value = value;
};
defineExpose({
  canDrag,
  setCanDrag,
  handleInsertCard,
});
</script>

<style scoped>
.scroll-snap-mandatory {
  scroll-snap-type: x mandatory;
}
</style>
