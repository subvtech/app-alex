<template>
  <div>
    <alex-custom-card
        title="Encontros"
        full-width
        :no-icon="true"
        class="tw-w-full tw-h-full"
        :is-editing="editMeetings"
        content-class-name="justify-center align-center h-100"
        no-footer
        @click:save="onSave"
        @click:cancel="onCancel"
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
             class="tw-overflow-auto tw-h-full "
             >
            <div
              v-for="(meeting, index) in todayMeetings"
              :key="index"
              class=" tw-p-3 rounded-lg tw-hover:tw-bg-gray-blue"
            >
              <div class="tw-flex tw-justify-between">
                <div class="tw-flex tw-items-center gap-2">
                  <div class="text-body-2">{{ meeting.scheduleName }}</div>
                  <alex-custom-chip :size="'small'" :text="meeting.interval" :status="'blue'"/>
                </div>
                <div class="text-body-3 ">{{ meeting.formattedDate }}</div>
              </div>

            </div>
            <alex-custom-button
              v-if="editMeetings"
              variant="text"
              @click="scheduleToUpdate = null"
            >
            <alex-learningplan-dialogs-schedule
              v-model="scheduleModal"
              :learning-plan-id="learningPlanId"
              :data="scheduleToUpdate"
              @update:schedules="scheduleModal"
              @create="handleCreate"
              @update="confirmUpdate"
            />
            teste
            </alex-custom-button>
          </div>
          <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full tw-h-full">
            <meeting/>

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
import meeting from './meeting.vue';
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const i18n = useI18n();
const editMeetings = ref(false)
const scheduleToUpdate = ref()
const scheduleModal = ref(false)
const classModel = ref();
const deleteModal = ref(false);

interface newSchedule {
  id?: number;
  date: string;
  type: 'online' | 'onsite';
  interval: number;
  startHour: string;
  endHour: string;
  link?: string;
  location?: string;
  endDate: string;
  startDate: string;
  learningplan: number;
  learning_class: number;
}

type ScheduleChange = {
  className?: string;
  id?: number;
  type: 'create' | 'delete' | 'update';
  schedule?: newSchedule;
};

const backUpSchedules = ref();
const schedulesChanges = ref<ScheduleChange[]>([]);

interface props {
  schedules:LearningPlanScheduleSimple[]
  learningPlanId:string
}

enum Interval {
  Diario = 0,
  Semanal = 1,
  Quinzenal = 7,
  Mensal = 14,
  Anual = 30
}

function getIntervalName(value:Interval) {
  return Interval[value]
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
    .filter(meeting => meeting.date.split('T')[0] === selectedDay.value)
    .map(meeting => ({
      ...meeting,
      scheduleName: schedule.name,
      interval: getIntervalName(schedule.interval),
      formattedDate: formatMeetingDate(meeting.date)
    }))
  )
))

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

const findClassByName = (className) => {
  return classModel.value?.find((classItem) => classItem?.name === className);
};

const convertDate = (date, time) => {
  const [hour, minute] = time.split(':');
  const [year, month, day] = date.split('-');
  return new Date(year, month - 1, day, hour, minute);
};


const handleCreate = (newSchedule)=>{
  const { className, id, ...schedule} = newSchedule
  const scheduleClass = findClassByName(className)
  scheduleClass?.value.push({
    schedule:{
      ...schedule,
      date:newSchedule.date,
      startDate:convertDate(newSchedule.date, newSchedule.startHour),
      endDate: convertDate(props.classInfo?.end, newSchedule.endHour),
      learningplan: props.learningPlanId,
      learning_class:scheduleClass.id
    },
    id,
    className,
    type:'create'
  })
}

const updateScheduleId = (className, scheduleID, resID) => {
  const classItem = findClassByName(className);
  const schedule = classItem?.schedules.find(
    (schedule) => schedule.id === scheduleID,
  );
  schedule.id = resID;
};

const onSave = async () => {
  const endpoint = 'learning-plan-meeting-schedules';
  try {
    const tasks = schedulesChanges.value.map((element) => {
      switch (element.type) {
        case 'create':
          if (element.schedule === undefined) {
            throw new Error('element.schedule is undefined');
          }
          return strapi.create(endpoint, element.schedule).then((res) => {
            updateScheduleId(element.className, element.id, res.data.id);
          });
        case 'delete':
          return strapi.delete(endpoint, element.id);
        case 'update':
          if (element.schedule?.id === undefined) {
            throw new Error('element.schedule.id is undefined');
          }
          return strapi.update(endpoint, element.schedule.id, element.schedule);
        default:
          return Promise.resolve();
      }
    });

    await Promise.all(tasks);

    setMessage(i18n.t('components.courses.meeting.success'), 'green', true);
  } catch (error) {
    setMessage(i18n.t('components.courses.meeting.errorSaving'), 'error', true);
  }
  schedulesChanges.value = [];
  editMeetings.value = false;
};

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

const onCancel = () => {
  classModel.value = deepClone(backUpSchedules.value);
  editMeetings.value = false;
  schedulesChanges.value = [];
  editMeetings.value = false;
};

const handleDelete = (className: string, scheduleID: number) => {
  deleteModal.value = true;
  schedulesChanges.value.push({
    className,
    id: scheduleID,
    type: 'delete',
  });
};

const confirmUpdate = (newSchedule) => {
  const scheduleUpdateClass = findClassByName(newSchedule.className);

  if (newSchedule.className === scheduleToUpdate.value.className) {
    scheduleUpdateClass?.schedules.splice(
      scheduleUpdateClass?.schedules.findIndex(
        (schedule) => schedule.id === newSchedule.id,
      ),
      1,
      newSchedule,
    );
  } else {
    const scheduleOldClass = findClassByName(scheduleToUpdate.value.className);
    scheduleOldClass?.schedules.splice(
      scheduleOldClass?.schedules.findIndex(
        (schedule) => schedule.id === newSchedule.id,
      ),
      1,
    );
    scheduleUpdateClass?.schedules.push(newSchedule);
  }

  const classId = findClassByName(newSchedule.className)?.id;
  scheduleModal.value = true;
  schedulesChanges.value.push({
    type: 'update',
    schedule: {
      ...newSchedule,
      date: newSchedule.date,
      startDate: convertDate(newSchedule.date, newSchedule.startHour),
      endDate: convertDate(props.classInfo?.end, newSchedule.endHour),
      learningplan: props.learningPlanId,
      learning_class: classId,
    },
  });
};

</script>

<style lang="scss" scoped>

</style>
