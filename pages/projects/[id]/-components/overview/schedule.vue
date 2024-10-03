<template>
  <v-card
    class="d-flex w-100 py-3 px-4 align-start justify-space-between"
    variant="outlined"
    color="gray-blue"
    rounded="lg"
    elevation="0"
  >
  <div class="tw-flex tw-w-full tw-items-center justify-space-between">
    <div>
      <p class="text-body-1 text-gray-800">{{ formatDate(meeting.date) }}</p>
      <p class="text-body-1 text-gray-500" >{{ getIntervalName(meeting.schedule.interval) }}: cada Quarta-feira</p>
    </div>
    <div class="tw-flex tw-items-center gap-2" >
      <p class="text-body-1 text-gray-800" >
        {{ meeting.formattedDate }} às {{ formatDateToHours(meeting.schedule.endDate) }}
      </p>
      <alex-custom-button variant="text" icon="mdi-pencil-outline" />
    </div>

  </div>
  </v-card>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

const { t } = useI18n();

const items = [
  { title: t('pages.projects.overview.no_repeat'), value: 0 },
  { title: t('pages.projects.overview.daily'), value: 1 },
  { title: t('pages.projects.overview.weekly'), value: 7 },
  { title: t('pages.projects.overview.biweekly'), value: 14 },
  { title: t('pages.projects.overview.monthly'), value: 30 },
];

function getIntervalName(value:number) {
  const interval = items.find(item => item.value === value)
  return interval?.title
}

const formatDate = (dateString:string) => {
  const day = new Date(dateString)
  const month = format(day, 'MMMM');
  const dayName = format(day, 'EEEE')
  const date = format(day, 'd')

  return `${dayName}, ${month} ${date}`
}

const formatDateToHours = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm');
};

interface meetingProps {
  schedule:LearningPlanScheduleSimple,
  scheduleName: string;
  interval: string | undefined;
  formattedDate: string;
  date: string;
  is_expired: boolean;
  earliest?: boolean;
}

const props = defineProps({
  meeting: {
    type: Object as PropType<meetingProps>,
    required: true,
  },
})

</script>

<style lang="scss" scoped>

</style>
