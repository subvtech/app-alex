<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <alex-custom-dialog
        v-model="dialogStepper"
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
        @on-main-action="() => console.log('maina')"
      >
        <template #activator="{ props }">
          <alex-custom-button v-bind="props"
            >Abrir Dialog Stepper</alex-custom-button
          >
        </template>
        <template #step1
          ><alex-inputs-text-field
            density="comfortable"
            name="name"
            label="Como vai se chamar seu Curso?"
            placeholder="Digite o nome do Curso"
            required
          />
          <alex-inputs-text-area
            density="comfortable"
            name="description"
            label="Do que se trata seu curso?"
            placeholder="Digite uma descrição do Curso"
            theme="light"
            required
          />
          <alex-inputs-text-field
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
        <template #step2> <alex-custom-carousel :slides="slides" /></template>
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
              ><alex-learningplan-modal-schedule v-model="scheduleModal" />Novo
              Encontro</alex-custom-button
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
              frequency="sunday"
              class="test"
              :date="schedule.date"
              :start-hour="schedule.startHour"
              :end-hour="schedule.endHour"
              :variant="'editing'"
              :dropdown-props="[
                {
                  onClick: () => console.log('editar'),
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
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const dialogStepper = ref(false);
const scheduleModal = ref(false);
const startDate = ref<Date>(new Date());
const endDate = ref<Date>(new Date());
const slides = ref([]);
const selectedUsers = ref([]);
const schedules = ref([
  {
    id: '1',
    date: new Date().toISOString(),
    startHour: new Date().toISOString(),
    endHour: new Date().toISOString(),
  },
  {
    id: '2',
    date: new Date().toISOString(),
    startHour: new Date().toISOString(),
    endHour: new Date().toISOString(),
  },
]);
const { createCourseRules } = useFormRules();

const removeSelf = (id: string) => {
  schedules.value = schedules.value.filter((item) => item.id !== id);
};
definePageMeta({
  middleware: 'auth',
  layout: 'components',
});
</script>

<style scoped lang="scss">
.max-w-200 {
  max-width: 200px;
}
</style>
