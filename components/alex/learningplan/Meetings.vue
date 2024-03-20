<template>
  <alex-custom-card
    :title="$t('components.meeting.title')"
    :show-icon="canEdit"
    class="w-100"
    :is-editing="editMeetings"
    :save="onSave"
    :cancel="onCancel"
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
          />
          {{
            $t('components.courses.meeting.course.addButton')
          }}</alex-custom-button
        >
        <alex-learningplan-class-meetings
          v-model="classModel"
          :variant="editMeetings ? 'editing' : 'default'"
          :no-edit="true"
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
const isLoading = ref(false);
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

type ScheduleChange = {
  name?: string;
  id?: number;
  type: 'create' | 'delete' | 'update';
  schedule?: any;
};

const backUpSchedules = ref();
const schedulesChanges = ref<ScheduleChange[]>([]);
const classModel = ref();

const hasMeetings = computed(() => {
  return classModel.value?.some((classItem) => classItem.schedules?.length > 0);
});

const getSchedules = (classItem) => {
  return classItem.meeting_schedules?.map((item) => {
    const earliestMeeting = item.meetings?.find(
      (meeting) => new Date(meeting.date) >= new Date(),
    );
    const startHour = item.startDate.split('T')[1].slice(0, 5);
    const endHour = item.endDate.split('T')[1].slice(0, 5);
    return {
      id: item.id,
      startHour,
      endHour,
      interval: item.interval,
      date: earliestMeeting?.date ? new Date(earliestMeeting.date) : new Date(),
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

  for (let i in obj) {
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
  try {
    for (const element of schedulesChanges.value) {
      switch (element.type) {
        case 'create':
          await strapi.create(
            'learning-plan-meeting-schedules',
            element.schedule,
          );
          break;
        case 'delete':
          await strapi.delete('learning-plan-meeting-schedules', element.id);
          break;
        case 'update':
          await strapi.update(
            'learning-plan-meeting-schedules',
            element.schedule.id,
            element.schedule,
          );
          break;
      }
    }
    setMessage(i18n.t('components.courses.meeting.success'), 'green', true);
  } catch (error) {
    setMessage(i18n.t('components.courses.meeting.errorSaving'), 'error', true);
  }
  schedulesChanges.value = [];
};

const onCancel = () => {
  classModel.value = deepClone(backUpSchedules.value);
  schedulesChanges.value = [];
};

const handleCreate = (newSchedule) => {
  const classId = classModel.value?.find(
    (classItem) => classItem?.name === newSchedule.className,
  ).id;

  const schedule = { ...newSchedule };
  delete schedule.id;

  schedulesChanges.value.push({
    schedule: {
      ...schedule,
      startDate: props.classInfo?.start,
      endDate: props.classInfo?.end,
      learningplan: props.learningPlanId,
      learning_class: classId,
    },
    type: 'create',
  });
  classModel.value
    .find((classItem) => classItem.name === newSchedule.className)
    .schedules.push(newSchedule);
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
  classModel.value
    .find((classItem) => classItem.name === DeletedSchedule.name)
    .schedules.splice(
      classModel.value
        .find((classItem) => classItem.name === DeletedSchedule.name)
        .schedules.findIndex((schedule) => schedule.id === DeletedSchedule.id),
      1,
    );
};

const cancelDelete = () => {
  deleteModal.value = false;
  schedulesChanges.value.pop();
};

const scheduleToUpdate = ref();

const handleUpdate = (className: string, newSchedule) => {
  scheduleToUpdate.value = {
    ...newSchedule,
    className,
  };
  scheduleModal.value = true;
};

const confirmUpdate = (className: string, newSchedule) => {
  schedulesChanges.value.push({
    name: className,
    type: 'update',
    schedule: newSchedule,
  });
  classModel.value
    .find((classItem) => classItem.name === className)
    .schedules.splice(
      classModel.value
        .find((classItem) => classItem.name === className)
        .schedules.findIndex((schedule) => schedule.id === newSchedule.id),
      1,
      newSchedule,
    );
};
</script>

<style scoped lang="scss">
.add-button {
  text-transform: none;
  border: 1px dashed var(--cinza-cinza-600, #6e7a87);
}
</style>
