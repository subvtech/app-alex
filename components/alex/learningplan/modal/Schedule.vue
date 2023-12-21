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
  >
    <alex-inputs-select
      v-model="frequency"
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
        v-model="hour"
        type="time"
        name="hour"
        :label="$t('components.courses.meeting.course.startTime')"
        required
        class="w-100"
        density="comfortable"
      />
      <alex-inputs-text-field
        v-model="minutes"
        type="time"
        name="minutes"
        :label="$t('components.courses.meeting.course.endTime')"
        required
        class="w-100"
        density="comfortable"
      />
    </div>
    <template #footer>
      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            text="Adicionar"
            size="large"
            prepend-icon="mdi-plus"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            text="Cancelar"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
          />
        </template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface ScheduleProps {
  modelValue: boolean;
  data?: {
    frequency: number;
    meetingDate: Date;
    hour: string;
    minutes: string;
  };
}
interface frequencyItem {
  title: string;
  value: number;
}

const props = withDefaults(defineProps<ScheduleProps>(), {
  modelValue: undefined,
  data: undefined,
});

const emit = defineEmits(['update:modelValue', 'submit']);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const items: frequencyItem[] = [
  { title: 'Não se repete', value: 0 },
  { title: 'Diário', value: 1 },
  { title: 'Semanal', value: 7 },
  { title: 'Quinzenal', value: 14 },
  { title: 'Mensal', value: 30 },
];
const meetingDate = ref<Date | undefined>(props.data?.meetingDate);
const frequency = ref<number | null>(props.data?.frequency || 0);
const hour = ref(props.data?.hour || '');
const minutes = ref(props.data?.minutes || '');
</script>
