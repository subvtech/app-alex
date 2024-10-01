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
      v-model="meeting.title"
      name="title"
      label="Nome do encontro"
      density="comfortable"
      required
    />
    <alex-inputs-date v-model="meeting.date" name="date" label="Data do encontro" required />

    <div class="w-100 d-flex gap-4 md-0 flex-wrap flex-sm-nowrap">
      <alex-inputs-text-field
        v-model="meeting.startTime"
        type="time"
        name="startHour"
        label="Início"
        required
        class="flex-sm-grow-0 w-100 min-w-60"
        density="comfortable"
      />
      <alex-inputs-text-field
        v-model="meeting.endTime"
        type="time"
        name="endHour"
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
        { title: 'Quinzenal', value: 15 },
        { title: 'Mensal', value: 30 },
        { title: 'Único', value: 0 },
      ]"
      density="comfortable"
    />
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
interface meetingType {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  interval: 1 | 7 | 15 | 30 | 0;
  id?: string;
}

// const { t } = useI18n();
const { projectsMeetingsRules } = useFormRules();

const emit = defineEmits(['create', 'update']);
const defaultMeeting = {
  title: '',
  date: '',
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

const openDialog = (newMeeting?: meetingType) => {
  meeting.value = newMeeting ? { ...newMeeting } : { ...defaultMeeting };
  showDialog.value = true;
};

// TODO: CRUD - o endpoint é o padrão de schedules, adicionar toast de confirmação
const onSubmit = handleSubmit(async () => {
  isLoading.value = true;
  emit(meeting.value.id ? 'update' : 'create', meeting.value);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  isLoading.value = false;
  showDialog.value = false;
});

defineExpose({
  openDialog,
});
</script>

<!--
Pra chamar esse dialog, vc importa ele no dialog de listagem e define uma ref, ai quando for usar o dialog é so chamar a função openDialog passando o objeto do encontro que vc quer editar ou criar, tipo createMeetingRef?.openDialog() para criar um novo e createMeetingRef?.openDialog(meeting) para editar um existente

<template>
<createMeeting ref="createMeetingRef"  @update @create/>
</template>

<script setup lang="ts">
const createMeetingRef = ref();
</script>

-->
