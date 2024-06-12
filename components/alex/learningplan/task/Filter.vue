<template>
  <v-navigation-drawer
    :model-value="modelValue"
    location="right"
    temporary
    floating
    scrim="transparent"
    sticky
    :width="380"
    class="py-6 rounded-s-lg"
    @update:model-value="handleChange"
  >
    <div class="d-flex flex-column ga-4 h-full w-full bg-white">
      <div class="d-flex align-center ga-4 pb-2 px-4">
        <p class="text-h4 flex-fill">
          {{ i18Texts.title }}
        </p>
        <alex-custom-button
          icon="mdi-close"
          variant="text"
          size="small"
          flat
          @click="handleChange(false)"
        />
      </div>

      <hr class="mb-2" />

      <div class="flex-fill px-4">
        <alex-inputs-select
          v-model="filters.select"
          name="convite"
          :items="classes.length ? classes : types"
          :placeholder="i18Texts.selectPlaceholder"
          clearable
          density="comfortable"
          hide-details
          :label="i18Texts.selectLabel"
        />

        <div v-if="!kanbanFilter">
          <p class="text-p1 text-gray-800 mt-4 mb-2">
            {{ $t('components.learningPlan.drawer.startDate') }}
          </p>
          <div class="d-flex align-center ga-1">
            <alex-inputs-date
              v-model="filters.startDate.start"
              class="flex-1-1"
              name="startDate"
              hide-details
              density="comfortable"
            />
            <alex-inputs-date
              v-model="filters.startDate.end"
              class="flex-1-1"
              hide-details
              name="finalDate"
              density="comfortable"
            />
          </div>
        </div>
        <p class="text-p1 text-gray-800 mt-4 mb-2">
          {{ $t('components.learningPlan.drawer.finalDate') }}
        </p>
        <div class="d-flex align-center ga-1">
          <alex-inputs-date
            v-model="filters.finalDate.start"
            class="flex-1-1"
            name="startDate"
            hide-details
            density="comfortable"
          />
          <alex-inputs-date
            v-model="filters.finalDate.end"
            class="flex-1-1"
            hide-details
            name="finalDate"
            density="comfortable"
          />
        </div>
        <div v-if="!kanbanFilter" class="mt-4">
          <p class="text-body-1 text-gray-800">
            {{ $t('components.learningPlan.drawer.archivedTasks') }}
          </p>
          <v-switch
            v-model="filters.archivedTasks"
            class="archived-switch"
            inset
            hide-details
          ></v-switch>
        </div>
      </div>
      <hr />

      <div class="d-flex ga-1 pa-4">
        <alex-custom-button
          class="flex-1-1"
          variant="secondary"
          size="large"
          @click="clearFilters"
          >{{ $t('components.learningPlan.drawer.clean') }}</alex-custom-button
        >
        <alex-custom-button
          class="flex-1-1"
          size="large"
          @click="handleFilter"
          >{{ $t('components.learningPlan.drawer.filter') }}</alex-custom-button
        >
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
const { t } = useI18n();

interface Filter {
  modelValue: boolean;
  classes?: Array<string>;
  kanbanFilter?: boolean;
}

const props = withDefaults(defineProps<Filter>(), {
  modelValue: false,
  classes: () => [],
  kanbanFilter: false,
});

const filters = ref({
  select: null,
  archivedTasks: false,
  startDate: {
    start: '',
    end: '',
  },
  finalDate: {
    start: '',
    end: '',
  },
});

const i18Texts = computed(() => {
  const drawer = 'components.learningPlan.drawer';
  return props.classes.length
    ? {
        title: t(`${drawer}.filter`),
        selectPlaceholder: t(`${drawer}.selectClassPlaceholder`),
        selectLabel: t(`${drawer}.class`),
      }
    : {
        title: t(`${drawer}.filterTasks`),
        selectPlaceholder: t(`${drawer}.selectTypePlaceholder`),
        selectLabel: t(`${drawer}.type`),
      };
});

const types = [
  { title: t('components.learningPlan.drawer.group'), value: 'group' },
  {
    title: t('components.learningPlan.drawer.individual'),
    value: 'individual',
  },
];

const emits = defineEmits(['update:modelValue', 'filter']);

const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const handleFilter = () => {
  const nonEmptyFilters = Object.fromEntries(
    Object.entries(filters.value).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([key, value]) => {
        if (value === null || value === false) {
          return false;
        }
        if (typeof value === 'object') {
          return value.start !== '' || value.end !== '';
        }
        return true;
      },
    ),
  );
  emits('filter', nonEmptyFilters);
  handleChange(false);
};

const removeFilter = (key: string) => {
  if (key === 'archivedTasks') filters.value[key] = false;
  else if (key === 'select') filters.value[key] = null;
  else
    filters.value[key] = {
      start: '',
      end: '',
    };
  handleFilter();
};

defineExpose({
  removeFilter,
});

const clearFilters = () => {
  filters.value = {
    select: null,
    archivedTasks: false,
    startDate: {
      start: '',
      end: '',
    },
    finalDate: {
      start: '',
      end: '',
    },
  };
  emits('filter', {});
};
</script>

<style>
.archived-switch {
  .v-switch__thumb {
    transform: none !important;
  }
  .v-switch__track {
    background-color: rgb(var(--v-theme-gray-200)) !important;
  }
  .v-switch__track {
    background-color: rgb(var(--v-theme-gray-200)) !important;
  }
  .v-selection-control--dirty .v-switch__track {
    background-color: #ade8ee !important;
  }
  .v-switch__thumb {
    background-color: rgb(var(--v-theme-gray-500)) !important;
  }
  .v-selection-control--dirty .v-switch__thumb {
    background-color: rgb(var(--v-theme-secondary-0)) !important;
  }
}
</style>
