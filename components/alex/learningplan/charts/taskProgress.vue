<template>
  <div class="tw-w-full tw-bg-white tw-rounded-md">
    <div class="tw-border-b tw-p-2 tw-flex tw-justify-between tw-items-center">
      <h3>{{ $t('pages.projects.overview.task_progress') }}</h3>
      <alex-inputs-select v-model="selectedSprint" class="!tw-p-0 !tw-h-14" name="sprints" :items="options" />
    </div>
    <div class="tw-flex tw-flex-col tw-items-center tw-p-4">
      <DonutChart
        class="!tw-w-full"
        index="name"
        :data="taskData"
        :category="props.categories"
        :colors="colors"
        :value-formatter="
          (tick: number | Date) =>
            typeof tick === 'number' ? `${new Intl.NumberFormat('us').format(tick).toString()} ${$t('task')}` : ''
        "
      />
      <span>{{ $t('pages.projects.overview.empty_task_progress', { percentage }) }}</span>
      <span class="tw-text-sm tw-text-gray-500">
        {{ $t('pages.projects.overview.last_update') }}
        {{ lastUpdate }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DonutChart } from '~/components/ui/chart-donut';

interface SprintData {
  sprint: string;
  columns: {
    status: string;
    name: string;
    total: number;
  }[];
}

interface TaskProgressProps {
  categories: 'name' | 'total';
  data: SprintData[];
  lastUpdate: Date | string;
}

const props = defineProps<TaskProgressProps>();

const selectedSprint = ref();
const options = ref();
const percentage = ref<number>(0);

const colorsMapping = {
  to_do: '#F1416C',
  doing: '#50CD89',
  done: '#00A3FF',
  default: '#E4E6EF',
};

function calculateDonePercentageForSprint(sprint: SprintData): number {
  let totalAllColumns = 0;
  let totalDoneColumns = 0;

  if (!sprint || !sprint.columns) return 0;

  sprint.columns?.forEach((column) => {
    totalAllColumns += column.total;
    if (column.status === 'done') {
      totalDoneColumns += column.total;
    }
  });

  if (totalAllColumns === 0) {
    return 0;
  }

  const donePercentage = parseFloat(((totalDoneColumns / totalAllColumns) * 100).toFixed(2));

  return donePercentage;
}

watch(
  () => props.data,
  (newData) => {
    if (newData.length > 0) {
      selectedSprint.value = newData[0].sprint;
    }
  },
  { immediate: true },
);

watch(
  selectedSprint,
  (newSprint) => {
    const sprintData = props.data.find((sprint) => sprint.sprint === newSprint);
    if (sprintData) {
      percentage.value = calculateDonePercentageForSprint(sprintData);
    }
  },
  { immediate: true },
);

const colors = computed(() => {
  const sprint = props.data.find((sprint) => sprint.sprint === selectedSprint.value);
  return sprint?.columns?.map((item) => colorsMapping[item.status] || colorsMapping.default) || [];
});

const taskData = computed(() => {
  options.value = props.data.map((sprint) => sprint.sprint);

  const selectedColumns = props.data.find((sprint) => sprint.sprint === selectedSprint.value)?.columns || [];
  return selectedColumns.map(({ name, total }) => ({ name, total }));
});

const lastUpdate = computed(() => props.lastUpdate);
</script>

<style lang="scss" scoped></style>
