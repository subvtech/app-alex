<template>
  <alex-custom-dialog
    v-model="value"
    title="Criar nova sprint"
    main-button-text="Criar sprint"
  >
    <alex-inputs-select
      v-model="sprint.type"
      density="comfortable"
      name="type"
      label="Tipo de criação"
      item-title="label"
      item-value="value"
      :items="typeOptions"
      required
    />
    <alex-inputs-text-field
      v-model="sprint.name"
      density="comfortable"
      name="title"
      label="Nome da sprint"
      :placeholder="
        sprint.type === 'single'
          ? 'Digite um nome para a sprint'
          : 'Nomes gerados automaticamente'
      "
      :disabled="sprint.type === 'multiple'"
      :required="sprint.type === 'single'"
    />
    <alex-inputs-select
      v-model="sprint.interval"
      density="comfortable"
      name="duration"
      label="Duração"
      placeholder="Selecione uma duração"
      item-title="label"
      item-value="value"
      :items="intervalOptions"
      required
    />
    <div class="w-100 d-flex gap-4 flex-wrap">
      <alex-inputs-date
        v-model="sprint.startDate"
        class="flex-grow-1 min-w-60"
        name="startDate"
        label="Início da sprint"
        required
        density="comfortable"
        :allowed-dates="disablePastDates"
      />
      <alex-inputs-date
        v-model="sprint.endDate"
        class="flex-grow-1 min-w-60"
        density="comfortable"
        name="endDate"
        required
        label="Término da sprint"
        :disabled="!isEndDateEnabled"
        :allowed-dates="disablePastDates"
      />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { format, addWeeks, startOfDay } from 'date-fns';

interface sprintType {
  type: 'multiple' | 'single';
  name?: string;
  startDate: string;
  endDate: string;
  interval:
    | 'one-week'
    | 'two-weeks'
    | 'three-weeks'
    | 'four-weeks'
    | 'custom'
    | null;
}

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const passedDate = new Date(date);
  return passedDate >= today;
};

const sprint = ref<sprintType>({
  type: 'single',
  name: '',
  startDate: '',
  endDate: '',
  interval: null,
});

const value = ref(false);

watch(
  () => sprint.value.type,
  (newType) => {
    if (newType === 'multiple') {
      sprint.value.name = '';
    }
  },
);

watch(
  () => [sprint.value.interval, sprint.value.startDate],
  ([newInterval, newStartDate]) => {
    if (newInterval === null || newInterval === 'custom' || !newStartDate) {
      return;
    }

    const [year, month, day] = newStartDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const endDate = addWeeks(startOfDay(startDate), weeks[newInterval]);

    sprint.value.endDate = format(endDate, 'yyyy-MM-dd');
  },
);

const isEndDateEnabled = computed(() => {
  return sprint.value.interval === null || sprint.value.interval === 'custom';
});

const typeOptions = [
  { label: 'Múltiplas sprints (automático)', value: 'multiple' },
  { label: 'Única sprint (manual)', value: 'single' },
];

const intervalOptions = [
  { label: '1 semana', value: 'one-week' },
  { label: '2 semanas', value: 'two-weeks' },
  { label: '3 semanas', value: 'three-weeks' },
  { label: '4 semanas', value: 'four-weeks' },
  { label: 'Personalizado', value: 'custom' },
];

const weeks = {
  'one-week': 1,
  'two-weeks': 2,
  'three-weeks': 3,
  'four-weeks': 4,
};
</script>
