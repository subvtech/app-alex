<script setup lang="ts">
import { format } from 'date-fns/esm';
import { enIN, ptBR } from 'date-fns/locale';
import { DonutChart } from '~/components/ui/chart-donut';

const { locale } = useI18n();

export interface TaskProgressProps {
  categories: 'name' | 'total';
  lastUpdate: Date | string;
  sprints?: {
    id: string;
    title: string;
    start_at: Date | string;
    end_at: Date | string;
    kanban: {
      kanban_columns: {
        id: string;
        kanban_column_tasks: { task: History }[];
        position: string;
        status_type: string;
        title: string;
      }[];
    };
  }[];
}

const statusColors = {
  default: '#E4E6EF',
  doing: '#50CD89',
  done: '#00A3FF',
  to_do: '#F1416C',
};

const props = withDefaults(defineProps<TaskProgressProps>(), {
  sprints: () => [],
});

const options = ref<string[]>([]);
const selectedSprint = ref<string>();
const formattedDate = computed(() => {
  return format(new Date(props.lastUpdate), `d MMM y`, { locale: locale.value === 'pt' ? ptBR : enIN });
});

const progress = computed(() => {
  return props.sprints.map((sprint) => ({
    sprint: sprint.title,
    columns: sprint.kanban?.kanban_columns?.map((column) => ({
      status: column.status_type,
      name: column.title,
      total: column.kanban_column_tasks?.reduce((count, taskGroup) => {
        return count + (taskGroup.task ? 1 : 0);
      }, 0),
    })),
  }));
});

const colors = computed(() => {
  const sprint = progress.value.find((sprint) => sprint.sprint === selectedSprint.value);

  return (
    sprint?.columns?.map((item) => {
      if (!statusColors[item.status]) statusColors[item.status] = generateRandomColor();
      return statusColors[item.status];
    }) || []
  );
});

const percentage = computed(() => {
  const sprint = progress.value.find((sprint) => sprint.sprint === selectedSprint.value);

  return calculateDonePercentageForSprint(sprint);
});

const taskData = computed(() => {
  options.value = progress.value.map((sprint) => sprint.sprint) || [];

  return (
    progress.value
      .find((sprint) => sprint.sprint === selectedSprint.value)
      ?.columns?.map(({ name, total }) => ({ name, total })) || []
  );
});

const calculateDonePercentageForSprint = (sprint?: (typeof progress.value)[0]): number => {
  let totalAllColumns = 0;
  let totalDoneColumns = 0;

  sprint?.columns?.forEach((column) => {
    totalAllColumns += column.total;
    if (column.status === 'done') totalDoneColumns += column.total;
  });

  return totalAllColumns ? parseFloat(((totalDoneColumns / totalAllColumns) * 100).toFixed(2)) : 0;
};

const formatNumber = (tick: number | Date) => {
  return typeof tick === 'number' ? `${new Intl.NumberFormat('us').format(tick).toString()}` : '';
};

const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; // prettier-ignore
};

watch(
  () => progress.value,
  (data) => !selectedSprint.value && data.length && (selectedSprint.value = data[0].sprint),
  { immediate: true },
);
</script>

<template>
  <div class="tw-w-full tw-bg-white tw-rounded-md tw-min-h-[470px]">
    <div class="tw-border-b tw-flex tw-justify-between tw-items-center pa-4 pl-6 tw-h-[72px]">
      <h4 class="text-gray-800 text-h4">{{ $t('pages.projects.overview.task_progress') }}</h4>
      <alex-inputs-select
        v-if="options.length"
        v-model="selectedSprint"
        hide-details
        density="compact"
        name="sprints"
        :items="options"
      />
    </div>
    <div class="tw-flex tw-flex-col tw-items-center pa-6">
      <DonutChart
        class="!tw-w-full"
        index="name"
        :data="taskData"
        :category="props.categories"
        :colors="colors"
        :sub-label="$t('pages.projects.overview.total_tasks')"
        :value-formatter="formatNumber"
      />
      <div class="pb-6 pt-2 ga-4 d-flex flex-wrap justify-center">
        <div
          v-for="(categoriesLabel, index) in taskData"
          :key="categoriesLabel.name"
          class="tw-flex tw-w-[160px] tw-rounded tw-border tw-items-center tw-p-1 tw-pr-2 tw-gap-2"
        >
          <div class="tw-h-[16px] tw-w-[16px] tw-rounded" :style="{ backgroundColor: colors[index] }" />
          <span class="text-gray-400 text-body-6 tw-overflow tw-w-[102px]"> {{ categoriesLabel.name }}</span>
          <span class="text-gray-800 text-body-6">{{ categoriesLabel.total }}</span>
        </div>
      </div>
      <span class="text-gray-800 text-body-2 mb-1 text-center">
        {{ $t('pages.projects.overview.empty_task_progress', { percentage }) }}
      </span>
      <span class="text-body-3 text-gray-600">
        {{ $t('pages.projects.overview.last_update') }}
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>
