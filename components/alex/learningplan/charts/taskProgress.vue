<template>
  <div class="tw-w-full tw-bg-white">
    <div class="tw-border-b tw-p-2 tw-flex tw-justify-between tw-items-center">
      <h3>{{ $t('pages.projects.task_progress') }}</h3>
      <alex-inputs-select
        v-model="selectedSprint"
        class="!tw-p-0 !tw-h-14"
        name="sprints"
        :items="options"
      />
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
            typeof tick === 'number'
              ? `${new Intl.NumberFormat('us').format(tick).toString()} ${$t(
                  'task',
                )}`
              : ''
        "
      />
      <span>{{ $t('pages.projects.empty_task_progress') }}</span>
      <span class="tw-text-sm tw-text-gray-500">
        {{ $t('pages.projects.last_update') }}
        {{ lastUpdate }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DonutChart } from '~/components/ui/chart-donut';

interface sprintData {
  sprint: string;
  columns: {
    status: string;
    name: string;
    total: number;
  }[];
}

interface TaskProgressProps {
  categories: 'name' | 'total';
  data: sprintData[];
  lastUpdate: Date | string;
}

const props = defineProps<TaskProgressProps>();

const selectedSprint = ref(props.data[0]?.sprint);

const colorsMapping = {
  to_do: '#F1416C',
  doing: '#50CD89',
  done: '#00A3FF',
  default: '#E4E6EF',
};

const colors = computed(
  () =>
    props.data[0]?.columns.map(
      (item) => colorsMapping[item.status] || colorsMapping.default,
    ),
);

const options = props.data.map((sprint) => sprint.sprint);

const taskData = computed(() => {
  const selectedColumns =
    props.data.find((sprint) => sprint.sprint === selectedSprint.value)
      ?.columns || [];
  return selectedColumns.map(({ name, total }) => ({ name, total }));
});
const lastUpdate = computed(() => props.lastUpdate);
</script>

<style lang="scss" scoped></style>
