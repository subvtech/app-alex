<template>
  <alex-custom-dialog
    v-model="value"
    :title="dialogTitle"
    :main-button-text="dialogMainButtonText"
    :secondary-button-text="t('components.projects.sprint.secondaryButtonText')"
  >
    <alex-inputs-select
      v-if="!taskId"
      v-model="sprint.type"
      density="comfortable"
      name="type"
      :label="$t('components.projects.sprint.type.label')"
      item-title="label"
      item-value="value"
      :items="typeOptions"
      required
    />
    <alex-inputs-text-field
      v-model="sprint.name"
      density="comfortable"
      name="title"
      :label="t('components.projects.sprint.name.label')"
      :placeholder="namePlaceholder"
      :disabled="sprint.type === 'multiple'"
      :required="sprint.type === 'single'"
    />
    <alex-inputs-select
      v-model="sprint.interval"
      density="comfortable"
      name="duration"
      :label="$t('components.projects.sprint.duration.label')"
      :placeholder="$t('components.projects.sprint.duration.placeholder')"
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
        :label="$t('components.projects.sprint.startDate')"
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
        :label="$t('components.projects.sprint.endDate')"
        :disabled="!isEndDateEnabled"
        :allowed-dates="disablePastDates"
      />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { format, addWeeks, startOfDay } from 'date-fns';

interface sprintType {
  type?: 'multiple' | 'single';
  name?: string;
  startDate: string;
  endDate?: string;
  interval:
    | 'one-week'
    | 'two-weeks'
    | 'three-weeks'
    | 'four-weeks'
    | 'custom'
    | null;
}

const { t } = useI18n();

const props = withDefaults(
  defineProps<{ sprintData: sprintType; taskId: string }>(),
  {
    sprintData: () => ({
      type: 'single',
      name: '',
      startDate: '',
      endDate: '',
      interval: null,
    }),
    taskId: '',
  },
);

const sprint = ref<sprintType>(props.sprintData);
const value = defineModel<boolean>({ required: true });

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const passedDate = new Date(date);
  return passedDate >= today;
};

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
  { label: t('components.projects.sprint.type.multiple'), value: 'multiple' },
  { label: t('components.projects.sprint.type.single'), value: 'single' },
];

const getDurationLabel = (duration: string) => {
  return t(`components.projects.sprint.duration.${duration}`);
};

const intervalOptions = [
  {
    label: getDurationLabel('one-week'),
    value: 'one-week',
  },
  {
    label: getDurationLabel('two-weeks'),
    value: 'two-weeks',
  },
  {
    label: getDurationLabel('three-weeks'),
    value: 'three-weeks',
  },
  { label: getDurationLabel('four-weeks'), value: 'four-weeks' },
  { label: getDurationLabel('custom'), value: 'custom' },
];

const dialogTitle = computed(() =>
  props.taskId
    ? t('components.projects.sprint.title.edit')
    : t('components.projects.sprint.title.create'),
);

const dialogMainButtonText = computed(() =>
  props.taskId
    ? t('components.projects.sprint.mainButtonText.edit')
    : t('components.projects.sprint.mainButtonText.create'),
);

const namePlaceholder = computed(() =>
  props.taskId || sprint.value.type === 'single'
    ? t('components.projects.sprint.name.defaultPlaceholder')
    : t('components.projects.sprint.name.multiplePlaceholder'),
);

const weeks = {
  'one-week': 1,
  'two-weeks': 2,
  'three-weeks': 3,
  'four-weeks': 4,
};
</script>
