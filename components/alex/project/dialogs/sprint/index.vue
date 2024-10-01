<template>
  <alex-custom-dialog
    v-model="dialog"
    :title="dialogTitle"
    :main-button-text="dialogMainButtonText"
    :secondary-button-text="t('components.projects.sprint.secondaryButtonText')"
    :loading="isLoading"
    @on-secondary-action="dialog = false"
    @on-main-action="onSubmit"
  >
    <alex-inputs-select
      v-if="!sprintData?.id"
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
      v-model="sprint.title"
      density="comfortable"
      name="name"
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
        v-model="sprint.start_at"
        class="flex-grow-1 min-w-60"
        name="startDate"
        :label="$t('components.projects.sprint.startDate')"
        required
        density="comfortable"
        :allowed-dates="disablePastDates"
      />
      <alex-inputs-date
        v-model="sprint.end_at"
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
import { useForm } from 'vee-validate';

interface sprintType {
  type?: 'multiple' | 'single';
  title?: string;
  start_at: string;
  end_at: string;
  interval: 'one-week' | 'two-weeks' | 'three-weeks' | 'four-weeks' | 'custom' | null;
  id?: number;
}

interface sprintProps extends Omit<sprintType, 'interval' | 'start_at' | 'end_at'> {
  start_at: Date | string;
  end_at: Date | string;
}

interface propsType {
  sprintData: sprintProps;
  projectId: number;
  projectEndDate: string;
  sprintsLength: number;
}

const { t } = useI18n();
const { createSprintRules } = useFormRules();
const client = useStrapiClient();
const { update } = useStrapi();
const { setMessage } = useMessageStore();
const emit = defineEmits(['create', 'update']);

const props = withDefaults(defineProps<propsType>(), {
  sprintData: () => ({
    type: 'single',
    name: '',
    start_at: '',
    end_at: '',
    interval: null,
    id: 0,
  }),
});

const sprint = ref<sprintType>({
  type: 'single',
  title: '',
  start_at: '',
  end_at: '',
  interval: null,
});
const dialog = defineModel<boolean>({ required: true });
const isLoading = ref(false);
const currentProjectId = ref(props.projectId);
const currentSprintId = ref(props.sprintData?.id);
const currentProjectEndDate = ref(props.projectEndDate);

const { handleSubmit } = useForm({
  validationSchema: createSprintRules,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    const adjustToUserTimeZone = (dateStr: string) => {
      const date = new Date(dateStr);
      const userOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
      const adjustedDate = new Date(date.getTime() + userOffset);
      return adjustedDate.toISOString();
    };

    const startDate = adjustToUserTimeZone(values.startDate);
    const endDate = adjustToUserTimeZone(values.endDate);

    if (!currentSprintId.value) {
      await client('sprints/create-multiple', {
        method: 'POST',
        body: {
          sprints: {
            start_at: startDate,
            end_at: endDate,
            type: values.type,
            title: values.name,
          },
          projectId: currentProjectId.value,
          projectEndDate: currentProjectEndDate.value,
          sprintsLength: props.sprintsLength,
        },
      });
      emit('create');
    } else {
      await update('sprints', currentSprintId.value, {
        title: values.name,
        start_at: startDate,
        end_at: endDate,
      });
      emit('update');
    }
    setMessage(
      t(`components.projects.sprint.successMessage.${currentSprintId.value ? 'edit' : 'create'}`),
      'success',
      true,
    );
    dialog.value = false;
  } catch (error) {
    setMessage(
      t(`components.projects.sprint.errorMessage.${currentSprintId.value ? 'edit' : 'create'}`),
      'error',
      true,
    );
  } finally {
    isLoading.value = false;
  }
});

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const passedDate = new Date(date);
  return passedDate >= today;
};

const dateToString = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};

watch(dialog, (newValue) => {
  if (newValue) {
    if (props.sprintData?.id) {
      const startDate = dateToString(new Date(props.sprintData.start_at));
      const endDate = dateToString(new Date(props.sprintData.end_at));
      sprint.value = {
        ...props.sprintData,
        interval: getDurationInterval(startDate, endDate),
        start_at: startDate,
        end_at: endDate,
      };
    } else {
      sprint.value = {
        type: 'single',
        title: '',
        start_at: '',
        end_at: '',
        interval: null,
      };
    }
    currentSprintId.value = props.sprintData?.id;
    currentProjectId.value = props.projectId;
    currentProjectEndDate.value = props.projectEndDate;
    isLoading.value = false;
  }
});

watch(
  () => sprint.value.type,
  (newType) => {
    if (newType === 'multiple') {
      sprint.value.title = '';
    }
  },
);

watch(
  () => [sprint.value.interval, sprint.value.start_at],
  ([newInterval, newStartDate]) => {
    if (newInterval === null || newInterval === 'custom' || !newStartDate) {
      return;
    }
    const [year, month, day] = newStartDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const endDate = addWeeks(startOfDay(startDate), weeks[newInterval]);
    sprint.value.end_at = dateToString(endDate);
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
  currentSprintId.value ? t('components.projects.sprint.title.edit') : t('components.projects.sprint.title.create'),
);

const dialogMainButtonText = computed(() =>
  currentSprintId.value
    ? t('components.projects.sprint.mainButtonText.edit')
    : t('components.projects.sprint.mainButtonText.create'),
);

const namePlaceholder = computed(() =>
  currentSprintId.value || sprint.value.type === 'single'
    ? t('components.projects.sprint.name.defaultPlaceholder')
    : t('components.projects.sprint.name.multiplePlaceholder'),
);

const weeks = {
  'one-week': 1,
  'two-weeks': 2,
  'three-weeks': 3,
  'four-weeks': 4,
};

const getDurationInterval = (startDate: string, endDate: string) => {
  const defaultInterval = ['one-week', 'two-weeks', 'three-weeks', 'four-weeks'];
  const diff = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const calcWeeks = diffDays / 7;
  return defaultInterval.length - 1 < calcWeeks ? 'custom' : (defaultInterval[calcWeeks - 1] as sprintType['interval']);
};
</script>
