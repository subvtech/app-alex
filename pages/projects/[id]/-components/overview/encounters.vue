<template>
  <div>
    <alex-custom-card
        title="Encontros"
        full-width
        :no-icon="true"
        class="tw-w-full tw-h-full"
        content-class-name="justify-center align-center h-100"
        no-footer
        @toggle:is-editing="toggleEditMode"
      >
        <template #content>

          <div class="tw-text-center tw-w-full mb-2">
                <span class="text-body-3 text-gray-500">
                  {{ weekNumber }}° semana de
                </span>
                <span class="text-body-4 text-secondary-0">
                   {{ monthName }}
                </span>
              </div>

            <!-- TODO: Trocar isso aqui por tabs -->
            <div class="tw-flex tw-gap-1 ga-6 tw-items-center mb-4 tw-overflow-auto tw-min-h-20 justify-center   tw-w-full">
              <div v-for="day in currentWeek" :key="day.value">
                <div
                  @click="selectDay(day.value)"
                  class="tw-h-[57px] tw-w-[41px] pa-2 rounded-lg tw-cursor-pointer"
                  variant="text"
                  :class="
                    day.value === selectedDay ? 'bg-secondary-0 tw-text-white' : 'tw-bg-white'
                  "
                >
                  <div class="tw-flex tw-flex-col text-center">
                    <span class="text-body-3">{{ day.name }}</span>
                    <span
                      class="text-body-2"
                      :class="day.value === selectedDay ? 'tw-text-white' : ' text-secondary-0'"
                      >{{ day.date }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
             class="tw-overflow-auto tw-h-full tw-w-full"
             >
            <div
              v-for="(meeting, index) in todayMeetings"
              :key="index"
              class=" tw-p-3 rounded-lg hover:bg-gray-blue"
            >
              <div class="tw-flex tw-justify-between">
                <div class="tw-flex tw-items-center gap-2">
                  <div class="text-body-2">{{ meeting.scheduleName }}</div>
                  <alex-custom-chip :size="'small'" :text="meeting.interval" :status="'blue'"/>
                </div>
                <div class="text-body-3 ">{{ meeting.formattedDate }}</div>
              </div>

            </div>
          </div>
          <div class="tw-flex tw-flex-col tw-gap-2 ">
            <dialogList
              v-model="editMeetings"
              :meetings="todayMeetings"
            />
            <alex-custom-empty-placeholder
              v-if="todayMeetings.length === 0 && !editMeetings"
              :empty-text-message="$t('pages.projects.overview.empty_meetings')"
              empty-text-image="/svg/OverviewEmptyMeetings.svg"
              grayscale
            />
          </div>
        </template>
      </alex-custom-card>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import dialogList from './dialogs/listMeeting.vue';
const { t } = useI18n();
const editMeetings = ref(false)
const classModel = ref();

const backUpSchedules = ref();

interface props {
  schedules:LearningPlanScheduleSimple[]
  learningPlanId:string
}

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

const props = defineProps({
  learningPlanId: {
    type: String,
    default: true,
  },
  schedules: {
    type: Array as PropType<LearningPlanScheduleSimple[]>,
    required: true,
  },
  classInfo: {
    type: Object,
    required: false,
  },
});


const today = new Date()
const selectedDay = ref(today.toISOString().split('T')[0])

const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
const firstDayOfWeek = today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1);

const weekNumber = computed(() => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentDay = today.getDate();

  return Math.ceil((currentDay + firstDayOfMonth.getDay()) / 7);
});

const monthName = computed(() => {
  return format(today, 'MMMM');
});

const formatMeetingDate = (dateString: string) => {
  return format(new Date(dateString), 'HH:mm');
};


const todayMeetings = computed(() => (props.schedules.flatMap(schedule =>
  schedule.meetings
//    .filter(meeting => meeting.date.split('T')[0] === selectedDay.value)
    .map(meeting => ({
      ...meeting,
      schedule:schedule,
      scheduleName: schedule.name,
      interval: getIntervalName(schedule.interval),
      formattedDate: formatMeetingDate(meeting.date)
    }))
  )
))

console.log(todayMeetings)

const selectDay = (dayValue:string)=>{
  selectedDay.value = dayValue
}

const currentWeek = Array.from({ length: daysOfWeek.length }, (_v, i) => {
  const date = new Date(today.getFullYear(), today.getMonth(), firstDayOfWeek + i);
  return {
    name: daysOfWeek[i],
    date: date.getDate(),
    value: date.toISOString().split('T')[0],
  };
});


function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const clone = Array.isArray(obj) ? [] : {};

  for (const i in obj) {
    if (obj[i] instanceof Date) {
      clone[i] = new Date(obj[i].valueOf());
    } else if (typeof obj[i] === 'object' && obj[i] !== null) {
      clone[i] = deepClone(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }

  return clone;
}

const toggleEditMode = () => {
  editMeetings.value = !editMeetings.value;
  if (editMeetings.value) {
    backUpSchedules.value = deepClone(classModel.value);
  }
};

</script>

<style lang="scss" scoped>

</style>
