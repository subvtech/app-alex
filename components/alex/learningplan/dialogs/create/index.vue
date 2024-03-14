<template>
  <alex-custom-dialog
    v-model="value"
    :title="$t('components.learningPlan.dialogs.createNewCourse')"
    :name-main-button="$t('components.learningPlan.dialogs.create')"
    :name-second-button="$t('components.learningPlan.dialogs.cancel')"
    :steps-config="stepsConfig"
    :loading="loading"
    step-class="d-flex gap-1"
    stepper-indicator-class="d-flex"
    stepper
    persistent
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
        v-model="slug"
        class="mb-4"
        density="comfortable"
        name="slug"
        required
        persistent-hint
        :label="$t('components.learningPlan.dialogs.whatIsYourCourseSlug')"
        :placeholder="
          $t('components.learningPlan.dialogs.writeYourCourseIdentifier')
        "
        :info="$t('components.learningPlan.dialogs.infoSlug')"
        :hint="plataformUrl"
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
      <alex-learningplan-dialogs-create-class-schedule-manager
        v-model="classes"
        v-model:data="classData"
        title="Gerencie suas turmas!"
        subtitle="Adicione um nome e um responsável para cada turma."
        img="/svg/class.svg"
        :title-header="$t('components.learningPlan.dialogs.newMeeting')"
        :show-itens="!!classes.length"
      >
        <template #action-button="{ clickActionButton, onSubmit }">
          <alex-custom-button
            append-icon="mdi-plus"
            variant="secondary"
            @click="clickActionButton"
          >
            <alex-learningplan-dialogs-class
              v-model:data="classData"
              v-model="classModal"
              no-select-users
              @submit="(values) => onSubmit(values)"
            />
            Nova Turma</alex-custom-button
          ></template
        >
        <template #items>
          <alex-learningplan-dialogs-create-classes
            v-model="classes"
            v-model:edit-modal="classModal"
            v-model:data-class="classData"
          />
        </template>
      </alex-learningplan-dialogs-create-class-schedule-manager>
    </template>
    <template #step4>
      <alex-learningplan-dialogs-create-class-schedule-manager
        v-model="classes"
        :title-header="$t('components.learningPlan.dialogs.newMeeting')"
        :title="$t('components.courses.meeting.course.title')"
        :subtitle="$t('components.courses.meeting.course.subtitle')"
        :show-itens="!!schedules.length"
        :img="'/images/schedule-empty.svg'"
      >
        <template #action-button>
          <alex-custom-button append-icon="mdi-plus" variant="secondary"
            ><alex-learningplan-dialogs-schedule
              v-model="createScheduleModal"
              v-model:data="editData"
              :end-date="endDate"
              :start-date="startDate"
              @submit="
                (values) =>
                  !editData ? addMeeting(values) : editMeeting(values)
              "
            />{{
              $t('components.learningPlan.dialogs.syncMeetings')
            }}</alex-custom-button
          >
        </template>
        <!-- new Date(schedule.date.toString().replaceAll('-', '/')) -->
        <template #items>
          <div class="d-flex flex-column mt-4 gap-2">
            <alex-learningplan-meeting
              v-for="schedule in schedules"
              :id="schedule.id"
              :key="schedule.id"
              variant="editing"
              type="onsite"
              local="Casa do caralho"
              :interval="schedule.interval"
              :date="schedule.date"
              :start-hour="schedule.startHour"
              :end-hour="schedule.endHour"
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
      </alex-learningplan-dialogs-create-class-schedule-manager>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { MeetingPropsType } from '@/components/alex/learningplan/Meeting.vue';
const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
});
const emit = defineEmits(['update:modelValue', 'submit']);
const { create } = useStrapi4();
const value = defineModel<boolean>({ required: true });
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
    title: 'Turmas',
    subtitle: 'Ministradas',
  },
  step4: {
    title: t('components.learningPlan.dialogs.meetings'),
    subtitle: t('components.learningPlan.dialogs.synchronous'),
  },
};
const createScheduleModal = ref(false);
const loading = ref(false);
const startDate = ref<string>();
const endDate = ref<string>();
const slides = ref<any>([]);
const classData = ref(null);
const classes = ref<any>([]);
const classModal = ref(false);
const title = ref('');
const description = ref('');
const slug = ref('');
const selectedUsers = ref([]);
const schedules = ref<MeetingPropsType[]>([]);
const editData = ref<MeetingPropsType | null>(null);
const carousel = ref<{ clearSlides: () => unknown } | null>(null);
const slugFormated = computed(() =>
  slug.value.trim().toLowerCase().replaceAll(' ', '_'),
);
const plataformUrl = computed(
  () => `${window.location.host}/courses/${slugFormated.value}`,
);
const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = new Date(date);
  return parsedDate >= today;
};

const removeSelf = (id: number) => {
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
    id: Number.parseInt((Math.random() * 10000000000).toString()),
  });
};

const cleanFields = () => {
  schedules.value = [];
  classData.value = null;
  classes.value = [];
  slides.value = [];
  selectedUsers.value = [];
  title.value = '';
  description.value = '';
  slug.value = '';
  startDate.value = undefined;
  endDate.value = undefined;
  carousel?.value?.clearSlides();
};

const createCourse = async () => {
  try {
    loading.value = true;
    const courseData = await create('learningplans', {
      title: title.value.trim().replace(/\s+/g, ' '),
      description: description.value,
      start_date: startDate.value,
      end_date: endDate.value,
      type: 'course',
      slug: title.value.trim().replace(/\s+/g, '_').toLocaleLowerCase(),
      invitation_enabled: true,
      invitation_duration: 3600,
      members: selectedUsers.value,
      class_name: slug.value,
      schedules: schedules.value,
    });
    slides.value.map((item) =>
      create('medias', { ...item, learningplan: courseData.data.id }),
    );
    emit('submit');
    emit('update:modelValue', false);
    cleanFields();
    setMessage(t('components.dialog.successCreateCourse'), 'green', true);
  } catch (error: unknown) {
    const message = (error as { error: { message: string } })?.error?.message;
    if (message) {
      setMessage(message, 'red', true);
    } else {
      setMessage(t('components.dialog.cantCreateCourse'), 'red', true);
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
watch(schedules, (value) => {
  console.log(value);
});
</script>
