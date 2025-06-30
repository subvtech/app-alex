<template>
  <v-card class="tw-bg-white tw-shadow-sm" rounded="lg" elevation="0">
    <v-card-text class="pa-5">
      <div class="tw-text-gray-600 tw-text-sm tw-mb-1">{{ title }}</div>
      <div class="tw-text-4xl tw-font-bold tw-text-gray-900 tw-mb-4">
        <v-skeleton-loader v-if="isLoading" type="text" width="60" />
        <span v-else>{{ total.toString().padStart(2, '0') }}</span>
      </div>

      <div class="tw-flex tw-justify-center tw-mb-4">
        <v-skeleton-loader v-if="isLoading" type="avatar" width="128" height="128" />
        <DonutChart
          v-else
          :data="chartData"
          category="value"
          index="label"
          :colors="chartColors"
          type="donut"
          :show-legend="false"
          :show-tooltip="false"
          class="tw-w-32 tw-h-32"
        />
      </div>

      <div class="tw-space-y-2 tw-text-sm">
        <div v-for="(item, index) in legendItems" :key="item.label" class="tw-flex tw-items-center tw-justify-between">
          <div class="tw-flex tw-items-center tw-gap-2">
            <div class="tw-w-3 tw-h-3 tw-rounded-full" :class="getColorClass(index)"></div>
            <span>{{ item.label }}</span>
          </div>
          <v-skeleton-loader v-if="isLoading" type="text" width="20" />
          <span v-else class="tw-font-medium">{{ item.value }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import DonutChart from '~/components/ui/chart-donut/DonutChart.vue';

interface Props {
  title: string;
  total: number;
  stats: {
    created: number;
    participating: number;
    finalized: number;
  };
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
});

const chartColors = ['#14b8a6', '#5eead4', '#ccfbf1'];

const chartData = computed(() => [
  { label: 'Criados', value: props.stats.created },
  { label: 'Participando', value: props.stats.participating },
  { label: 'Finalizados', value: props.stats.finalized },
]);

const legendItems = computed(() => [
  { label: 'Criados', value: props.stats.created },
  { label: 'Participando', value: props.stats.participating },
  { label: 'Finalizados', value: props.stats.finalized },
]);

const getColorClass = (index: number) => {
  const classes = ['tw-bg-teal-500', 'tw-bg-teal-300', 'tw-bg-teal-100'];
  return classes[index];
};
</script>
