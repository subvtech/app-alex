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
          name="frequency"
          :label="$t('components.courses.meeting.course.meetingFrequency')"
          density="comfortable"
          required
        />
        <alex-inputs-date
          v-model="meetingDate"
          name="meetingDate"
          :label="$t('components.courses.meeting.course.meetingDate')"
          required
          class="w-100"
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

export interface Meeting {
  id: string;
  frequency: 0 | 1 | 7 | 14 | 30;
  meetingDate: Date;
  startHour: string;
  endHour: string;
}

interface ScheduleProps {
  modelValue: boolean;
  data?: Meeting | null;
}

const props = withDefaults(defineProps<ScheduleProps>(), {
  modelValue: undefined,
  data: undefined,
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

const data = computed({
  get() {
    return props.data;
  },
  set(value) {
    emit('update:data', value);
  },
});

const { handleSubmit, handleReset, setFieldValue } = useForm({
  validationSchema: scheduleRules,
  initialValues: {
    frequency: data.value?.frequency || 0,
    meetingDate: data.value?.meetingDate,
    startHour: data.value?.startHour || '',
    endHour: data.value?.endHour || '',
  },
});

const meetingDate = ref(data.value?.meetingDate);
const submit = handleSubmit((values) => {
  emit('submit', { ...values, id: props.data?.id });
  emit('update:modelValue', false);
  handleReset();
});

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
  }
});

watch(data, (value) => {
  if (value) {
    setFieldValue('frequency', value.frequency);
    setFieldValue('startHour', value.startHour);
    setFieldValue('endHour', value.endHour);
    setFieldValue('meetingDate', value.meetingDate);
    meetingDate.value = value.meetingDate;
  }
});
</script>
