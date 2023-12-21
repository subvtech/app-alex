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
        v-model="startHour"
        type="time"
        name="startHour"
        :label="$t('components.courses.meeting.course.startTime')"
        required
        class="w-100"
        density="comfortable"
      />
      <alex-inputs-text-field
        v-model="endHour"
        type="time"
        name="endHour"
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
            :text="$t(`components.courses.meeting.${data ? 'edit' : 'add'}`)"
            size="large"
            prepend-icon="mdi-plus"
            @click="
              () =>
                $emit('submit', { frequency, meetingDate, startHour, endHour })
            "
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
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
interface ScheduleProps {
  modelValue: boolean;
  data?: {
    id: string;
    frequency: number;
    meetingDate: Date;
    startHour: string;
    endHour: string;
  };
}

const props = withDefaults(defineProps<ScheduleProps>(), {
  modelValue: undefined,
  data: undefined,
});

const emit = defineEmits(['update:modelValue', 'update:data', 'submit']);

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
const meetingDate = ref<Date | undefined>(data.value?.meetingDate || undefined);
const frequency = ref<number | null>(data.value?.frequency || 0);
const startHour = ref(data.value?.startHour || '');
const endHour = ref(data.value?.endHour || '');
</script>
