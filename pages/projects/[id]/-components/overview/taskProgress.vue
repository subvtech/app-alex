<template>
  <div class="tw-w-full tw-bg-white tw-rounded-md tw-min-h-[470px]">
    <div class="tw-border-b tw-flex tw-justify-between tw-items-center pa-4 pl-6 tw-h-[72px]">
      <h4 class="text-gray-800 text-h4">{{ $t('pages.projects.overview.task_progress') }}</h4>
      <alex-inputs-select
        v-if="options.length > 0"
        v-model="selectedSprint"
        name="sprints"
        :items="options"
        hide-details
        density="compact"
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
        :value-formatter="
          (tick: number | Date) =>
            typeof tick === 'number' ? `${new Intl.NumberFormat('us').format(tick).toString()}` : ''
        "
      />
      <div class="pb-6 pt-2 ga-4 d-flex flex-wrap justify-center">
        <div
          v-for="(categoriesLabel, index) in taskData"
          :key="categoriesLabel.name"
          class="d-flex tw-w-[160px] rounded border align-center pa-1 pr-2 ga-2"
        >
          <div class="tw-h-[16px] tw-w-[16px] rounded" :style="{ backgroundColor: colors[index] }" />
          <span class="text-gray-400 text-body-6 tw-overflow tw-w-[102px]"> {{ categoriesLabel.name }}</span>
          <span class="text-gray-800 text-body-6">{{ categoriesLabel.total }}</span>
        </div>
      </div>
      <span class="text-gray-800 text-body-2 mb-1 text-center">{{
        $t('pages.projects.overview.empty_task_progress', { percentage })
      }}</span>
      <span class="text-body-3 text-gray-600">
        {{ $t('pages.projects.overview.last_update') }}
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { enIN, ptBR } from 'date-fns/locale';
import { DonutChart } from '~/components/ui/chart-donut';

const i18n = useI18n();

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
const options = ref<string[]>([]);
const percentage = ref<number>(0);

// TODO: As cores deveriam ser definidas ao criar as colunas

const colorsMapping = {
  to_do: '#F1416C',
  doing: '#50CD89',
  done: '#00A3FF',
  default: '#E4E6EF',
};

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const formattedDate = computed(() => {
  const tempDate = new Date(props.lastUpdate);
  return format(tempDate, `d MMM y`, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  });
});

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
  return (
    sprint?.columns?.map((item) => {
      if (!colorsMapping[item.status]) {
        colorsMapping[item.status] = generateRandomColor();
      }
      return colorsMapping[item.status];
    }) || []
  );
});

const taskData = computed(() => {
  options.value = props.data.map((sprint) => sprint.sprint) || [];

  const selectedColumns = props.data.find((sprint) => sprint.sprint === selectedSprint.value)?.columns || [];
  const res = selectedColumns.map(({ name, total }) => ({ name, total }));
  return res;
});
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid rgb(var(--v-theme-gray-100));
}
</style>
