<script setup lang="ts">
interface Counter {
  chipColor?: string;
  color?: string;
  icon: string;
  percentage: number;
  title: string;
  value: string | number;
}

export interface StatisticsWidgetProps {
  counters?: {
    finishedEpicsPercent: number;
    finishedSprintsPercent: number;
    finishedStoriesPercent: number;
    remainingDays: number;
    totalEpics: number;
    totalSprints: number;
    totalStories: number;
  };
}

const props = defineProps<StatisticsWidgetProps>();

const { t } = useI18n();

const statistics = computed(() => ({
  epics: {
    icon: 'alex:ManageHistory',
    percentage: props.counters?.finishedEpicsPercent || 0,
    title: t('pages.projects.overview.total_epics'),
    value: props.counters?.totalEpics || 0,
  },
  sprints: {
    icon: 'alex:Sprint',
    percentage: props.counters?.finishedSprintsPercent || 0,
    title: t('pages.projects.overview.total_sprints'),
    value: props.counters?.totalSprints || 0,
  },
  stories: {
    icon: 'alex:HistoryEdu',
    percentage: props.counters?.finishedStoriesPercent || 0,
    title: t('pages.projects.overview.total_story'),
    value: props.counters?.totalStories || 0,
  },
  remainingTime: {
    icon: 'mdi-calendar-clock',
    percentage: 0,
    title: t('pages.projects.overview.remaining_time'),
    value: `${props.counters?.remainingDays || 0} dias`,
  },
}));

const getAccentColor = (counter: Counter) => {
  return counter.color ? `${counter.color}` : 'secondary-0';
};

const getChipTextColor = (counter: Counter) => {
  return counter.chipColor ? `bg-${counter.chipColor}` : 'bg-secondary--2';
};
</script>

<template>
  <div class="tw-flex tw-flex-wrap gap-4 tw-mb-5">
    <Card
      v-for="item in Object.values(statistics)"
      :key="item.title"
      :totalizer="item"
      class="tw-flex-1 tw-gap-2 bg-white tw-w-full sm:tw-w-1/2 lg:tw-w-1/3 tw-min-w-72"
    >
      <CardContent class="!tw-p-0">
        <div class="tw-flex py-2 gap-4 overflow-hidden">
          <div class="h-full tw-w-2 tw-rounded-r-xl" :class="`bg-${getAccentColor}`"></div>
          <div class="tw-py-4 tw-flex tw-flex-col tw-gap-1">
            <div class="tw-flex tw-items-center tw-mb-1 tw-gap-2">
              <div class="bg-gray-blue rounded">
                <v-icon :icon="item.icon" size="24px" color="gray-600" class="ma-2" />
              </div>
              <span class="text-h4 text-gray-600">{{ item.title }}</span>
            </div>
            <span class="tw-text-[64px] tw-font-bold tw-mb-1 text-gray-800">{{ item.value }}</span>
            <div class="tw-flex tw-items-center tw-gap-2">
              <div
                class="tw-w-[40px] tw-h-[30px] d-flex tw-justify-center align-center rounded gap-1 text-body-1"
                :class="`text-${getAccentColor} ${getChipTextColor}`"
              >
                {{ `${item.percentage}%` }}
              </div>
              <span class="text-body-1 tw-text-gray-400">{{ $t('pages.projects.overview.completed') }}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
