<template>
  <alex-custom-card
    :title="$t('components.projects.individual_learning.overview.performance')"
    no-footer
    sizing-class="py-0 px-6"
    class="tw-min-h-[470px] h-100"
  >
    <template #content>
      <BarChart
        class="pa-5"
        index="name"
        :data="processedData"
        :categories="['grade', 'total']"
        :type="'stacked'"
        orientation="horizontal"
        :show-legend="false"
        :show-tooltip="false"
        :colors="['#4aca84', '#dcf5e7']"
        :x-formatter="
          (tick) => {
            return processedData.length ? tick.toString() : '';
          }
        "
        :y-formatter="
          (tick) => {
            if (typeof tick === 'number') {
              return tick % 1 === 0 ? data[tick]?.name : '';
            }
            return '';
          }
        "
      >
      </BarChart>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { BarChart } from '@/components/ui/chart-bar';

interface performanceProps {
  data: { name: string; grade: number }[];
  maxGrade?: number;
}

const props = withDefaults(defineProps<performanceProps>(), {
  maxGrade: 10,
});

const processedData = computed(() => {
  return props.data.map((item) => ({
    ...item,
    total: props.maxGrade - item.grade,
  }));
});
</script>
