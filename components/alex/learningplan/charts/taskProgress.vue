<template>
  <div class="tw-w-full">
    <alex-custom-card title="Progresso de tarefas">
      <template #content>
        <div class="tw-flex tw-flex-col tw-items-center">
          <DonutChart
            class="!tw-w-full"
            index="name"
            :data="data"
            :category="'total'"
            :colors="['#F1416C', '#50CD89', '#00A3FF', '#E4E6EF']"
            :value-formatter="(tick: number | Date) => `${data.length} Tarefas`"
          />
          <span>{{ $t('pages.projects.empty_task_progress') }}</span>
          <span class="tw-text-sm tw-text-gray-500">
            {{ $t('pages.projects.last_update') }}
            {{ lastUpdate }}
          </span>
        </div>
      </template>
    </alex-custom-card>
  </div>
</template>

<script setup lang="ts">
import { DonutChart } from '~/components/ui/chart-donut';

interface Data {
  name: String;
  total: number;
  predicted: number;
}

interface TaskProgressProps {
  categories: string[];
  data: Data[];
  lastUpdate: Date | string;
}

const props = defineProps<TaskProgressProps>();

const data = computed(() => props.data);
const lastUpdate = computed(() => props.lastUpdate);
</script>

<style lang="scss" scoped></style>
