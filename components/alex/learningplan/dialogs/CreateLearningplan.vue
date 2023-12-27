<template>
  <alex-custom-dialog
    v-model="value"
    :title="$t('components.learningPlan.dialogs.createNewCourse')"
    :name-main-button="$t('components.learningPlan.dialogs.create')"
    :name-second-button="$t('components.learningPlan.dialogs.cancel')"
    stepper
    :steps-config="stepsConfig"
    step-class="d-flex gap-1"
    stepper-indicator-class="d-flex"
    :loading="loading"
    @on-main-action="createCourse"
  >
    <template #step1
      ><alex-inputs-text-field
        v-model="title"
        density="comfortable"
        name="title"
        :label="$t('components.learningPlan.dialogs.titleCourseLabel')"
        :placeholder="
          $t('components.learningPlan.dialogs.titleCoursePlaceholder')
        "
        required
      />
      <alex-inputs-text-area
        v-model="description"
        density="comfortable"
        name="description"
        :label="$t('components.learningPlan.dialogs.aboutCourseLabel')"
        :placeholder="
          $t('components.learningPlan.dialogs.aboutCoursePlaceholder')
        "
        theme="light"
        required
      />
      <alex-inputs-text-field
        v-model="learningClass"
        density="comfortable"
        name="class"
        :label="$t('components.learningPlan.dialogs.classLabel')"
        :placeholder="$t('components.learningPlan.dialogs.classPlaceholder')"
        required
      />
      <div class="w-100 d-flex gap-4">
        <alex-inputs-date
          v-model="startDate"
          name="startDate"
          :label="$t('components.learningPlan.dialogs.startDateLabel')"
          required
          class="w-100"
          density="comfortable"
          :allowed-dates="disablePastDates"
        />
        <alex-inputs-date
          v-model="endDate"
          density="comfortable"
          name="endDate"
          required
          :label="$t('components.learningPlan.dialogs.endDateLabel')"
          class="w-100"
          :allowed-dates="disablePastDates"
        />
      </div>
    </template>
    <template #step2>
      <alex-custom-carousel ref="carousel" v-model="slides"
    /></template>
    <template #step3>
      <alex-inputs-users-autocomplete
        v-model="selectedUsers"
        name="users"
        class="w-100"
        :label="$t('components.learningPlan.dialogs.whoParticipate')"
        :placeholder="$t('components.learningPlan.dialogs.searchMember')"
      />
    </template>
    <template #step4>
      <div class="d-flex align-center justify-space-between">
        <p>{{ $t('components.learningPlan.dialogs.newMeeting') }}</p>
        <alex-custom-button append-icon="mdi-plus" variant="secondary"
          ><alex-learningplan-dialogs-schedule
            v-model="createScheduleModal"
            v-model:data="editData"
            :end-date="endDate"
            :start-date="startDate"
            @submit="
              (values) => (!editData ? addMeeting(values) : editMeeting(values))
            "
          />{{
            $t('components.learningPlan.dialogs.syncMeetings')
          }}</alex-custom-button
        >
      </div>
      <div v-if="!schedules.length">
        <div class="d-flex flex-column align-center justify-center gap-2">
          <v-img
            width="150px"
            height="120px"
            src="/images/schedule-empty.svg"
          />
          <div>
            <h2 class="text-body-2 text-gray-800 max-w-200 text-center">
              {{ $t('components.courses.meeting.course.title') }}
            </h2>
            <p class="text-body-5 text-gray-800 max-w-200 text-center">
              {{ $t('components.courses.meeting.course.subtitle') }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="d-flex flex-column mt-4 gap-2">
        <course-meeting
          v-for="schedule in schedules"
          :key="schedule.id"
          :interval="schedule.interval"
          :date="schedule.date"
          :start-hour="schedule.startHour"
          :end-hour="schedule.endHour"
          :variant="'editing'"
          :dropdown-props="[
            {
              onClick: () => {
                editData = schedule;
                createScheduleModal = true;
              },
              text: 'Editar',
              icon: 'mdi-pencil',
            },
            {
              onClick: () => schedule.id && removeSelf(schedule.id),
              text: 'Apagar',
              icon: 'mdi-trash-can-outline',
              warning: true,
            },
          ]"
        />
      </div>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { MeetingPropsType } from '@/components/CourseMeeting.vue';
const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
});

const emit = defineEmits(['update:modelValue', 'submit']);
const { create } = useStrapi4();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const { t } = useI18n();
const { setMessage } = useMessageStore();
const { createCourseRules } = useFormRules();
const stepsConfig = {
  step1: {
    title: t('components.learningPlan.dialogs.infos'),
    subtitle: t('components.learningPlan.dialogs.basics'),
    scheme: createCourseRules,
  },
  step2: {
    title: t('components.learningPlan.dialogs.media'),
    subtitle: t('components.learningPlan.dialogs.descriptive'),
  },
  step3: {
    title: t('components.learningPlan.dialogs.members'),
    subtitle: t('components.learningPlan.dialogs.participants'),
  },
  step4: {
    title: t('components.learningPlan.dialogs.meetings'),
    subtitle: t('components.learningPlan.dialogs.synchronous'),
  },
};
const createScheduleModal = ref(false);
const loading = ref(false);
const startDate = ref<Date>();
const endDate = ref<Date>();
const slides = ref([]);
const title = ref('');
const description = ref('');
const learningClass = ref('');
const selectedUsers = ref([]);
const schedules = ref<MeetingPropsType[]>([]);
const editData = ref<MeetingPropsType | null>(null);
const carousel = ref<{ clearSlides: () => unknown } | null>(null);

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = new Date(date);
  return parsedDate >= today;
};

const removeSelf = (id: string) => {
  schedules.value = schedules.value.filter((item) => item.id !== id);
};

const editMeeting = (values: MeetingPropsType) => {
  const updatedSchedules = schedules.value.map((meeting) => {
    if (meeting.id === values.id) {
      return { ...meeting, ...values };
    }
    return meeting;
  });
  schedules.value = updatedSchedules;
};
const addMeeting = (values: MeetingPropsType) => {
  schedules.value.push({
    ...values,
    id: crypto.randomUUID(),
  });
};

const cleanFields = () => {
  schedules.value = [];
  slides.value = [];
  selectedUsers.value = [];
  title.value = '';
  description.value = '';
  learningClass.value = '';
  startDate.value = undefined;
  endDate.value = undefined;
  carousel?.value?.clearSlides();
};

const createCourse = async () => {
  try {
    loading.value = true;
    await create('learningplans', {
      title: title.value.trim().replace(/\s+/g, ' '),
      description: description.value,
      start_date: startDate.value,
      end_date: endDate.value,
      type: 'course',
      slug: title.value.trim().replace(/\s+/g, '_').toLocaleLowerCase(),
      invitation_enabled: true,
      invitation_duration: 3600,
      members: selectedUsers.value,
      class_name: learningClass.value,
      media: slides.value,
      schedules: schedules.value,
    });
    emit('submit');
    emit('update:modelValue', false);
    schedules.value = [];
    slides.value = [];
    selectedUsers.value = [];
    title.value = '';
    description.value = '';
    learningClass.value = '';
    startDate.value = undefined;
    endDate.value = undefined;
  } catch (error: unknown) {
    const message = (error as { error: { message: string } })?.error?.message;
    if (message) {
      setMessage(message, 'red', true);
    } else {
      setMessage('Não foi possível criar o curso', 'red', true);
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  () => {
    if (!props.modelValue) {
      cleanFields();
    }
  },
);
</script>

<style scoped>
.max-w-200 {
  max-width: 200px;
}
</style>
