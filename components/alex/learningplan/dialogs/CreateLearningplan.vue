<template>
  <alex-custom-dialog
    v-model="value"
    title="Criar novo Curso"
    name-main-button="Criar"
    name-second-button="Cancelar"
    stepper
    :steps-config="{
      step1: {
        title: 'Informações',
        subtitle: 'Básicas',
        scheme: createCourseRules,
      },
      step2: { title: 'Mídia', subtitle: 'Descritiva' },
      step3: { title: 'Membros', subtitle: 'Participantes' },
      step4: { title: 'Encontros', subtitle: 'Síncronos' },
    }"
    step-class="d-flex gap-1"
    stepper-indicator-class="d-flex"
    @on-main-action="
      () =>
        create('learningplans', {
          title: title.replace(/\s+/g, ' ').trim(),
          description,
          start_date: startDate,
          end_date: endDate,
          type: 'course',
          slug: title.replace(/\s+/g, '_').trim().toLocaleLowerCase(),
          invitation_enabled: true,
          invitation_duration: 3600,
          members: selectedUsers,
          class_name: learningClass,
        })
    "
  >
    <template #step1
      ><alex-inputs-text-field
        v-model="title"
        density="comfortable"
        name="title"
        label="Como vai se chamar seu Curso?"
        placeholder="Digite o nome do Curso"
        required
      />
      <alex-inputs-text-area
        v-model="description"
        density="comfortable"
        name="description"
        label="Do que se trata seu curso?"
        placeholder="Digite uma descrição do Curso"
        theme="light"
        required
      />
      <alex-inputs-text-field
        v-model="learningClass"
        density="comfortable"
        name="class"
        label="Digite o nome da turma"
        placeholder="Digite o nome da turma"
        required
      />
      <div class="w-100 d-flex gap-4">
        <alex-inputs-date
          v-model="startDate"
          name="startDate"
          label="Quando iniciará o curso?"
          required
          class="w-100"
          density="comfortable"
        />
        <alex-inputs-date
          v-model="endDate"
          density="comfortable"
          name="endDate"
          required
          label="Quando terminará o curso?"
          class="w-100"
        />
      </div>
    </template>
    <template #step2> <alex-custom-carousel v-model="slides" /></template>
    <template #step3>
      <alex-inputs-users-autocomplete
        v-model:selected-items="selectedUsers"
        name="users"
        class="w-100"
        label="Quem participará?"
        placeholder="Buscar Integrante"
        density="comfortable"
        return-object
      />
    </template>
    <template #step4>
      <div class="d-flex align-center justify-space-between">
        <p>Momentos Síncronos</p>
        <alex-custom-button append-icon="mdi-plus" variant="secondary"
          ><alex-learningplan-dialogs-schedule
            v-model="createScheduleModal"
            v-model:data="editData"
            @submit="
              (values) => (!editData ? addMeeting(values) : editMeeting(values))
            "
          />Novo Encontro</alex-custom-button
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
      <div v-else>
        <course-meeting
          v-for="schedule in schedules"
          :key="schedule.id"
          :frequency="frequency[schedule.frequency]"
          :interval="schedule.frequency"
          :date="schedule.meetingDate"
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
              onClick: () => removeSelf(schedule.id),
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
import { Meeting } from '@/components/alex/learningplan/dialogs/Schedule.vue';

const props = withDefaults(defineProps<{ modelValue?: boolean }>(), {
  modelValue: false,
});

const emit = defineEmits(['update:modelValue']);
const { create } = useStrapi4();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const { createCourseRules } = useFormRules();
const createScheduleModal = ref(false);
const startDate = ref<Date>();
const endDate = ref<Date>();
const slides = ref([]);
const title = ref('');
const description = ref('');
const learningClass = ref('');
const selectedUsers = ref([]);
const schedules = ref<Meeting[]>([]);
const editData = ref<Meeting | null>(null);

const removeSelf = (id: string) => {
  schedules.value = schedules.value.filter((item) => item.id !== id);
};

const editMeeting = (values: Meeting) => {
  const updatedSchedules = schedules.value.map((meeting) => {
    if (meeting.id === values.id) {
      return { ...meeting, ...values };
    }
    return meeting;
  });
  schedules.value = updatedSchedules;
};
const addMeeting = (values: Meeting) => {
  schedules.value.push({ ...values, id: crypto.randomUUID() });
};

const frequency = {
  7: 'weekly',
  1: 'everyday',
  0: 'interval',
  30: 'monthly',
  14: 'biweekly',
};
</script>

<style scoped></style>
