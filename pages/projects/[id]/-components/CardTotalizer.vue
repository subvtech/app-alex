<template>
  <Card class="tw-flex-1 tw-gap-2 bg-white tw-w-full sm:tw-w-1/2 lg:tw-w-1/3 tw-min-w-72">
    <CardContent class="!tw-p-0">
      <div class="tw-flex py-2 gap-4 overflow-hidden">
        <div class="h-full tw-w-2 tw-rounded-r-xl" :class="`bg-${accentColor}`"></div>
        <div class="tw-py-4 tw-flex tw-flex-col tw-gap-1">
          <div class="tw-flex tw-items-center tw-mb-1 tw-gap-2">
            <div class="bg-gray-blue rounded">
              <v-icon :icon="totalizer.icon" size="24px" color="gray-600" class="ma-2" />
            </div>
            <span class="text-h4 text-gray-600">{{ totalizer.title }}</span>
          </div>
          <span class="tw-text-[64px] tw-font-bold tw-mb-1 text-gray-800">{{ totalizer.value }}</span>
          <div class="tw-flex tw-items-center tw-gap-2">
            <div
              class="tw-w-[40px] tw-h-[30px] d-flex tw-justify-center align-center rounded gap-1 text-body-1"
              :class="`text-${accentColor} ${chipTextColor}`"
            >
              {{ `${totalizer.percentage}%` }}
            </div>
            <span class="text-body-1 tw-text-gray-400">{{ $t('pages.projects.overview.completed') }}</span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
interface TotalizerType {
  title: string;
  value: string;
  percentage: number;
  icon: string;
  color?: string;
  chipColor?: string;
}

const props = withDefaults(defineProps<{ totalizer: TotalizerType }>(), {
  totalizer: () => ({
    title: 'Totalizer',
    value: '0',
    percentage: 0,
    icon: 'mdi-camera-timer',
    color: 'secondary-0',
    chipColor: 'secondary--2',
  }),
});

const chipTextColor = computed(() => {
  return props.totalizer.chipColor ? `bg-${props.totalizer.chipColor}` : 'bg-secondary--2';
});

const accentColor = computed(() => {
  return props.totalizer.color ? `${props.totalizer.color}` : 'secondary-0';
});
</script>
