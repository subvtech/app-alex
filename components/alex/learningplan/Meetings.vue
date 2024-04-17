<template>
  <alex-custom-card
    :title="$t('components.meeting.title')"
    :show-icon="canEdit"
    class="w-100"
    :is-editing="editMeetings"
    :disable-save="!schedulesChanges.length"
    @click:save="onSave"
    @click:cancel="onCancel"
    @toggle:is-editing="toggleEditMode"
  >
    <template #content>
      <div class="w-100">
        <alex-custom-button
          v-if="editMeetings"
          class="add-button w-100 mb-6"
          prepend-icon="mdi-plus"
          variant="text"
          size="large"
          @click="scheduleToUpdate = null"
        >
          <alex-learningplan-dialogs-schedule
            v-model="scheduleModal"
            :learning-plan-id="learningPlanId"
            :classes="classModel"
            :data="scheduleToUpdate"
            :start-date="classInfo?.start"
            :end-date="classInfo?.end"
            @update:schedules="scheduleModal"
            @create="handleCreate"
            @update="confirmUpdate"
          />
          {{
            $t('components.courses.meeting.course.addButton')
          }}</alex-custom-button
        >
        <alex-learningplan-class-meetings
          v-model="classModel"
          :variant="editMeetings ? 'editing' : 'default'"
          @update="handleUpdate"
          @delete="handleDelete"
        />
      </div>
      <div v-if="!hasMeetings" class="w-100">
        <p class="text-gray-500 text-center">
          {{ $t('components.courses.meeting.empty') }}
        </p>
      </div>
    </template>
  </alex-custom-card>
  <alex-learningplan-dialogs-alert
    v-model="deleteModal"
    variant="error"
    :image="{ src: '/svg/exclusionImage.svg', width: 120, height: 100 }"
    :title="$t('components.courses.meeting.deleteModal.confirmation')"
    :subtitle="$t('components.courses.meeting.deleteModal.description')"
    :submit-button-text="$t('components.courses.meeting.deleteModal.button')"
    no-input-confirmation
    @submit="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup lang="ts">
import { LearningClassType } from './dialogs/create/index.vue';
const strapi = useStrapi();
const { setMessage } = useMessageStore();
const i18n = useI18n();
const editMeetings = ref(false);
const scheduleModal = ref(false);
// const isLoading = ref(false);
const deleteModal = ref(false);
const props = defineProps({
  canEdit: {
    type: Boolean,
    default: false,
  },
  learningPlanClasses: {
    type: Array as PropType<LearningClassType[]>,
    required: true,
  },
  learningPlanId: {
    type: Number,
    required: true,
  },
  classInfo: {
    type: Object,
    required: true,
  },
});
// corrigir tipagem
type ScheduleChange = {
  name?: string;
  id?: number;
  type: 'create' | 'delete' | 'update';
  schedule?: any;
  ref?: classItem;
};

const backUpSchedules = ref();
const schedulesChanges = ref<ScheduleChange[]>([]);
const classModel = ref();

const hasMeetings = computed(() => {
  return classModel.value?.some((classItem) => classItem.schedules?.length > 0);
});

const findClassByName = (className) => {
  return classModel.value?.find((classItem) => classItem?.name === className);
};

const addScheduleChange = (change) => {
  schedulesChanges.value.push(change);
};

const getSchedules = (classItem) => {
  return classItem.meeting_schedules?.map((item) => {
    const earliestMeeting = item.meetings?.find(
      (meeting) => new Date(meeting.date) >= new Date(),
    );

    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    const startHour =
      String(startDate.getHours()).padStart(2, '0') +
      ':' +
      String(startDate.getMinutes()).padStart(2, '0');
    const endHour =
      String(endDate.getHours()).padStart(2, '0') +
      ':' +
      String(endDate.getMinutes()).padStart(2, '0');
    return {
      id: item.id,
      startHour,
      endHour,
      interval: item.interval,
      date: earliestMeeting?.date ? new Date(earliestMeeting.date) : false,
      location: item.type === 'onsite' ? item.location : undefined,
      link: item.type === 'online' ? item.link : undefined,
      type: item.type,
      name: classItem.name,
    };
  });
};

watch(
  () => props.learningPlanClasses,
  (newClasses) => {
    classModel.value = newClasses?.map((classItem) => ({
      name: classItem.name,
      id: classItem.id,
      schedules: getSchedules(classItem),
    }));
  },
);

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
const onSave = async () => {
  const endpoint = 'learning-plan-meeting-schedules';
  try {
    const tasks = schedulesChanges.value.map((element) => {
      switch (element.type) {
        case 'create':
          return strapi.create(endpoint, element.schedule).then((res) => {
            element.ref.id = res.data.id;
          });

        case 'delete':
          return strapi.delete(endpoint, element.id);
        case 'update':
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

const onCancel = () => {
  classModel.value = deepClone(backUpSchedules.value);
  editMeetings.value = false;
  schedulesChanges.value = [];
};

const convertDate = (date, time) => {
  const [hour, minute] = time.split(':');
  const [year, month, day] = date.split('-');
  return new Date(year, month - 1, day, hour, minute);
};

const handleCreate = (newSchedule) => {
  const { className, id, ...schedule } = newSchedule;
  const scheduleClass = findClassByName(className);
  scheduleClass?.schedules.push(newSchedule);
  addScheduleChange({
    schedule: {
      ...schedule,
      date: newSchedule.date,
      startDate: convertDate(newSchedule.date, newSchedule.startHour),
      endDate: convertDate(props.classInfo?.end, newSchedule.endHour),
      learningplan: props.learningPlanId,
      learning_class: scheduleClass.id,
    },
    ref: scheduleClass.schedules[scheduleClass.schedules.length - 1],
    type: 'create',
  });
};

const handleDelete = (className: string, scheduleID: number) => {
  deleteModal.value = true;
  schedulesChanges.value.push({
    name: className,
    id: scheduleID,
    type: 'delete',
  });
};

const confirmDelete = () => {
  const DeletedSchedule =
    schedulesChanges.value[schedulesChanges.value.length - 1];
  deleteModal.value = false;
  const classItem = findClassByName(DeletedSchedule.name);
  classItem?.schedules.splice(
    classItem?.schedules.findIndex(
      (schedule) => schedule.id === DeletedSchedule.id,
    ),
    1,
  );
};

const cancelDelete = () => {
  deleteModal.value = false;
  schedulesChanges.value.pop();
};

const scheduleToUpdate = ref();

const handleUpdate = (className: string, newSchedule) => {
  if (typeof newSchedule.date !== 'string') {
    newSchedule.date = newSchedule.date.toISOString().split('T')[0];
  }
  scheduleToUpdate.value = {
    ...newSchedule,
    className,
  };
  scheduleModal.value = true;
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

<style scoped lang="scss">
.add-button {
  text-transform: none;
  border: 1px dashed var(--cinza-cinza-600, #6e7a87);
}
</style>
