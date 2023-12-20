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
            density="compact"
            name="name"
            label="Como vai se chamar seu Curso?"
            placeholder="Digite o nome do Curso"
            required
          />
          <alex-inputs-text-area
            density="compact"
            name="description"
            label="Do que se trata seu curso?"
            placeholder="Digite uma descrição do Curso"
            theme="light"
            required
          />
          <alex-inputs-text-field
            density="compact"
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
              density="compact"
            />
            <alex-inputs-date
              v-model="endDate"
              density="compact"
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
        <template #step4>d</template>
      </alex-custom-dialog>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const dialogStepper = ref(false);
const startDate = ref<Date>();
const endDate = ref<Date>();
const slides = ref([]);
const selectedUsers = ref([]);
const { createCourseRules } = useFormRules();
definePageMeta({
  middleware: 'auth',
  layout: 'components',
});
</script>
