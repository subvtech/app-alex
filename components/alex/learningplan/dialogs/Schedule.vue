<template>
  <alex-custom-dialog
    v-model="modal"
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
        <alex-inputs-select
          name="className"
          label="Turma"
          density="comfortable"
          required
          :items="classes"
          placeholder="Selecione a turma para o encontro"
          item-title="name"
          item-value="name"
        />
        <alex-inputs-select
          name="type"
          label="Tipo do encontro"
          density="comfortable"
          required
          placeholder="Selecione o tipo do encontro"
          item-title="title"
          :items="[
            { title: 'Online', value: 'online' },
            { title: 'Presencial', value: 'onsite' },
          ]"
        />
        <alex-inputs-select
          name="interval"
          :label="$t('components.courses.meeting.course.meetingFrequency')"
          :items="items"
          placeholder="Selecione a frequência do encontro"
          density="comfortable"
          required
        />
        <alex-inputs-text-field
          :name="values.type === 'online' ? 'link' : 'location'"
          :label="
            values.type === 'online' ? 'Link do encontro' : 'Local do encontro'
          "
          density="comfortable"
          :placeholder="`Digite o ${
            values.type === 'online' ? 'link de acesso' : 'endereço'
          } do encontro`"
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
            @click="modal = false"
          />
        </template>
      </alex-custom-dialog-footer>
    </template>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { LearningClassType } from './create/index.vue';
import { MeetingPropsType } from '@/components/alex/learningplan/Meeting.vue';

interface ScheduleProps {
  modelValue: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  classes?: LearningClassType[];
}
const {
  startDate = undefined,
  endDate = undefined,
  classes = [],
} = defineProps<ScheduleProps>();
const emit = defineEmits(['update', 'create']);
const { scheduleRules } = useFormRules();
const modal = defineModel<boolean>({ required: true });
const data = defineModel<(MeetingPropsType & { className: string }) | null>(
  'data',
);
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

const {
  handleSubmit,
  setValues,
  values,
  handleReset,
  useFieldModel,
  resetForm,
} = useForm({
  validationSchema: rules.value,
  keepValuesOnUnmount: false,
});
const meetingDate = useFieldModel('date');
const submit = handleSubmit((values) => {
  if (!data.value) {
    const newId = Math.round(Math.random() * 12_345_68);
    emit('create', { ...values, id: newId, name: values.className });
  } else {
    emit('update', { ...values, id: data.value?.id, name: values.className });
  }
  modal.value = false;
});

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = new Date(date);
  return parsedDate >= today;
};
const items = [
  { title: 'Não se repete', value: 0 },
  { title: 'Diário', value: 1 },
  { title: 'Semanal', value: 7 },
  { title: 'Quinzenal', value: 14 },
  { title: 'Mensal', value: 30 },
];

onUpdated(() => {
  if (data.value) {
    setValues({
      className: data.value?.className,
      interval: data.value?.interval,
      startHour: data.value?.startHour,
      endHour: data.value?.endHour,
      date: data.value?.date,
      type: data.value?.type,
      location: data.value?.location,
      link: data.value?.link,
    });
    meetingDate.value = data.value?.date;
    return;
  }
  resetForm();
});
</script>
