<template>
  <alex-custom-dialog
    v-model="value"
    activator="parent"
    :title="
      $t(
        `components.courses.meeting.course.${
          data ? 'editMeeting' : 'addMeeting'
        }`,
      )
    "
    body-classes="pa-0 bg-white"
  >
    <v-form @reset="handleReset">
      <div class="pa-6">
        <alex-inputs-autocomplete
          name="class"
          label="Turma"
          density="comfortable"
          required
          :items="classes"
        />
        <alex-inputs-select
          name="type"
          label="Tipo do encontro"
          density="comfortable"
          required
          :items="['online', 'presencial']"
        />
        <alex-inputs-select
          name="interval"
          :label="$t('components.courses.meeting.course.meetingFrequency')"
          :items="items"
          density="comfortable"
          required
        />
        <alex-inputs-text-field
          :name="values.type === 'online' ? 'link' : 'local'"
          :label="
            values.type === 'online' ? 'Link do encontro' : 'Local do encontro'
          "
          density="comfortable"
          required
        />
        <alex-inputs-date
          v-model="meetingDate"
          name="date"
          :allowed-dates="(date) => disablePastDates(date)"
          :label="$t('components.courses.meeting.course.meetingDate')"
          required
          hint="Data que o encontro se inicia"
          persistent-hint
          class="w-100 mb-4"
          density="comfortable"
        />
        <div class="d-flex gap-4">
          <alex-inputs-text-field
            type="time"
            name="startHour"
            :label="$t('components.courses.meeting.course.startTime')"
            required
            class="w-100"
            density="comfortable"
          />
          <alex-inputs-text-field
            type="time"
            name="endHour"
            :label="$t('components.courses.meeting.course.endTime')"
            required
            class="w-100"
            density="comfortable"
          />
        </div>
      </div>
    </v-form>
    <template #footer>
      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            :text="$t(`components.courses.meeting.${data ? 'save' : 'add'}`)"
            size="large"
            :prepend-icon="data ? 'mdi-check' : 'mdi-plus'"
            @click="submit"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('components.courses.meeting.cancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="value = false"
          />
        </template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { MeetingPropsType } from '@/components/alex/learningplan/Meeting.vue';

interface ScheduleProps {
  modelValue: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  classes?: LearningClass[];
}
const {
  startDate = undefined,
  endDate = undefined,
  classes = [],
} = defineProps<ScheduleProps>();
const emit = defineEmits(['update:data', 'submit']);
const { scheduleRules } = useFormRules();
const value = defineModel<boolean>({ required: true });
const data = defineModel<MeetingPropsType | null>('data');
const rules = computed(() => {
  const startDateValue = startDate
    ? new Date(startDate.toString().replaceAll(/-/g, '/'))
    : new Date();
  const endDateValue = endDate
    ? new Date(endDate.toString().replaceAll(/-/g, '/'))
    : new Date();
  startDateValue.setUTCHours(0, 0, 0, 0);
  endDateValue.setHours(23, 59, 59, 59);
  return scheduleRules(startDateValue, endDateValue);
});

const { handleSubmit, handleReset, setFieldValue, values } = useForm({
  validationSchema: rules.value,
  initialValues: {
    interval: data.value?.interval || 0,
    date: data.value?.date,
    startHour: data.value?.startHour || '',
    endHour: data.value?.endHour || '',
    type: 'online',
    local: 'presencial',
    link: 'online',
  },
});
const meetingDate = ref(data.value?.date);
const submit = handleSubmit((values) => {
  emit('submit', { ...values, id: data.value?.id });
  value.value = false;
});

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = new Date(date);
  return parsedDate >= today;
};

const items: {
  title: string;
  value: number;
}[] = [
  { title: 'Não se repete', value: 0 },
  { title: 'Diário', value: 1 },
  { title: 'Semanal', value: 7 },
  { title: 'Quinzenal', value: 14 },
  { title: 'Mensal', value: 30 },
];

watch(value, () => {
  if (!value.value) {
    emit('update:data', null);
    meetingDate.value = undefined;
    handleReset();
    setFieldValue('interval', 0);
  }
});

watch(data, (value) => {
  if (value) {
    setFieldValue('interval', value.interval);
    setFieldValue('startHour', value.startHour);
    setFieldValue('endHour', value.endHour);
    setFieldValue('date', value.date);
    meetingDate.value = value.date;
  }
});
</script>
