<template>
  <alex-custom-dialog
    v-model="showDialog"
    :title="meeting?.id ? 'Editar encontros síncronos' : 'Criar encontros síncronos'"
    :main-button-text="meeting?.id ? 'Editar' : 'Criar'"
    :loading="isLoading"
    @on-main-action="onSubmit"
    @on-secondary-action="showDialog = false"
  >
    <alex-inputs-text-field
      v-model="meeting.name"
      name="title"
      label="Nome do encontro"
      density="comfortable"
      required
    />
    <alex-inputs-date v-model="meeting.startDate" name="startDate" label="Data do encontro" required />

    <div class="w-100 d-flex gap-4 md-0 flex-wrap flex-sm-nowrap">
      <alex-inputs-text-field
        v-model="meeting.startTime"
        type="time"
        name="startTime"
        label="Início"
        required
        class="flex-sm-grow-0 w-100 min-w-60"
        density="comfortable"
      />
      <alex-inputs-text-field
        v-model="meeting.endTime"
        type="time"
        name="endTime"
        label="Termino"
        required
        class="flex-sm-grow-0 w-100"
        density="comfortable"
      />
    </div>
    <alex-inputs-select
      v-model="meeting.interval"
      name="interval"
      label="Frequência do encontro"
      :items="[
        { title: 'Diário', value: 1 },
        { title: 'Semanal', value: 7 },
        { title: 'Quinzenal', value: 14 },
        { title: 'Mensal', value: 30 },
        { title: 'Único', value: 0 },
      ]"
      density="comfortable"
    />
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { format, parseISO } from 'date-fns';
import { useForm } from 'vee-validate';

const route = useRoute();
const learningPlanStore = useLearningPlanStore();
const learningPlanId = ref<string>(route.params.id as string)

interface meetingType {
  name: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  interval: 0 | 1 | 7 | 14 | 30;
  id?: number;
}

// const { t } = useI18n();
const { projectsMeetingsRules } = useFormRules();
const strapi = useStrapi();

const emit = defineEmits(['create', 'update']);
const defaultMeeting = {
  name: '',
  startDate: '',
  startTime: '',
  endTime: '',
  interval: 1,
} as meetingType;

const meeting = ref<meetingType>({ ...defaultMeeting });
const isLoading = ref(false);
const showDialog = ref(false);

const { handleSubmit } = useForm({
  validationSchema: projectsMeetingsRules,
});

const openDialog = (newMeeting?: LearningPlanScheduleSimple) => {
  if (newMeeting) {
    const startDateTime = parseISO(newMeeting.startDate);
    const endDateTime = parseISO(newMeeting.endDate);

    meeting.value = {
      id: newMeeting.id,
      name: newMeeting.name,
      startDate: format(startDateTime, 'yyyy-MM-dd'),
      startTime: format(startDateTime, 'HH:mm'),
      endDate: newMeeting.endDate ? format(parseISO(newMeeting.endDate), 'yyyy-MM-dd') : undefined,
      endTime: endDateTime ? format(endDateTime, 'HH:mm') : '',
      interval: newMeeting.interval,
    };
  } else {
    meeting.value = { ...defaultMeeting };
  }
  showDialog.value = true;
};

const onSubmit = handleSubmit(async () => {
  isLoading.value = true;
  const learningPlan = await learningPlanStore.loadLearningPlan(+route.params.id)
  const endpoint = 'learning-plan-meeting-schedules';

  const startDateTime = `${meeting.value.startDate}T${meeting.value.startTime}:00`;
  let endDateTime = meeting.value.endDate
    ? `${meeting.value.endDate}T${meeting.value.endTime}:00`
    : `${format(parseISO(learningPlan?.data.end_date as never), "yyy-MM-dd")}T${meeting.value.endTime}:00`;

  const { endTime, startTime, ...rest} = meeting.value

  const payload = {
    ...rest,
    startDate: startDateTime,
    endDate: endDateTime,
    learningplan:learningPlanId.value
  };

  if (meeting.value.id) {
    const schedule = await strapi.update(endpoint, payload);
    // learningPlan?.data.schedules.push(schedule.data.attributes)
  } else {
    strapi.create(endpoint, payload);
  }

  isLoading.value = false;
  showDialog.value = false;
});

defineExpose({
  openDialog,
});
</script>
