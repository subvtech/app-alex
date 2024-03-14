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
    body-classes="pa-0 bg-white rounded-b-lg"
    no-footer
  >
    <v-form @submit="submit" @reset="handleReset">
      <div class="pa-6">
        <alex-inputs-select
          :items="items"
          name="interval"
          :label="$t('components.courses.meeting.course.meetingFrequency')"
          density="comfortable"
          required
        />
        <alex-inputs-date
          v-model="meetingDate"
          name="date"
          :allowed-dates="(date) => disablePastDates(date)"
          :label="$t('components.courses.meeting.course.meetingDate')"
          required
          class="w-100 mt-4"
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
      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            :text="$t(`components.courses.meeting.${data ? 'save' : 'add'}`)"
            size="large"
            type="submit"
            :prepend-icon="data ? 'mdi-check' : 'mdi-plus'"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('components.courses.meeting.cancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="$emit('update:modelValue', false)"
          />
        </template>
      </alex-custom-dialog-footer>
    </v-form>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { MeetingPropsType } from '@/components/alex/learningplan/Meeting.vue';

interface ScheduleProps {
  modelValue: boolean;
  data?: MeetingPropsType | null;
  endDate?: Date | string;
  startDate?: Date | string;
}

const props = withDefaults(defineProps<ScheduleProps>(), {
  modelValue: undefined,
  data: undefined,
  endDate: undefined,
  startDate: undefined,
});

const emit = defineEmits(['update:modelValue', 'update:data', 'submit']);
const { scheduleRules } = useFormRules();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const rules = computed(() => {
  const startDate = props.startDate
    ? new Date(props.startDate.toString().replace(/-/g, '/'))
    : new Date();
  const endDate = props.endDate
    ? new Date(props.endDate.toString().replace(/-/g, '/'))
    : new Date();
  endDate.setUTCHours(23, 59, 59, 59);
  startDate.setHours(0, 0, 0, 0);
  return scheduleRules(startDate, endDate);
});
const data = computed({
  get() {
    return props.data;
  },
  set(value) {
    emit('update:data', value);
  },
});

const { handleSubmit, handleReset, setFieldValue } = useForm({
  validationSchema: rules.value,
  initialValues: {
    interval: data.value?.interval || 0,
    date: data.value?.date,
    startHour: data.value?.startHour || '',
    endHour: data.value?.endHour || '',
  },
});

const meetingDate = ref(data.value?.date);
const submit = handleSubmit((values) => {
  emit('submit', { ...values, id: props.data?.id });
  emit('update:modelValue', false);
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
<style scoped lang="scss"></style>
