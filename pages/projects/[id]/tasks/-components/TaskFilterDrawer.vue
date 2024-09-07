<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { t } = useI18n();

interface Filter {
  modelValue: boolean;
}

withDefaults(defineProps<Filter>(), {
  modelValue: false,
});

const filters = ref({
  members: [],
  startDate: {
    start: undefined,
    end: undefined,
  },
  finalDate: {
    start: undefined,
    end: undefined,
  },
});

const i18Texts = computed(() => {
  return {
    title: 'Filtros',
    selectPlaceholder: 'Selecionar Integrantes',
    selectLabel: 'Integrantes', // t(`${drawer}.type`),
  };
});
const schema = yup.object().shape(
  {
    finalDateStart: yup.date().optional(),
    finalDateEnd: yup
      .date()
      .optional()
      .when('finalDateStart', (value, scheme) => {
        if (!value[0]) {
          return scheme;
        }
        return scheme.optional().min(yup.ref('finalDateStart'), t('rules.endDate.beforeStartDate'));
      }),
    startDateStart: yup.date().optional(),
    startDateEnd: yup
      .date()
      .optional()
      .when('startDateStart', (value, scheme) => {
        if (!value[0]) {
          return scheme;
        }
        return scheme.optional().min(yup.ref('startDateStart'), t('rules.endDate.beforeStartDate'));
      }),
  },
  [
    ['finalDateStart', 'finalDateEnd'],
    ['startDateStart', 'startDateEnd'],
  ],
);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  keepValuesOnUnmount: true,
});

const emits = defineEmits(['update:modelValue', 'filter']);

const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const onSubmit = handleSubmit(() => {
  const nonEmptyFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_key, value]) => {
      if (Array.isArray(value)) {
        return !!value.length;
      }
      if (typeof value === 'object' && !Array.isArray(value)) {
        return value.start || value.end;
      }
      return true;
    }),
  );
  emits('filter', nonEmptyFilters);
  handleChange(false);
});

const removeFilter = (key: string) => {
  if (key === 'members') {
    filters.value[key] = [];
  } else {
    filters.value[key] = {
      start: undefined,
      end: undefined,
    };
  }

  onSubmit();
};

defineExpose({
  removeFilter,
});

const clearFilters = () => {
  filters.value = {
    members: [],
    startDate: {
      start: undefined,
      end: undefined,
    },
    finalDate: {
      start: undefined,
      end: undefined,
    },
  };
  emits('filter', {});
};
</script>

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
    <form class="d-flex flex-column ga-4 tw-h-full tw-w-full bg-white" @submit="onSubmit">
      <div class="d-flex align-center ga-4 px-4">
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
        <alex-inputs-users-autocomplete
          v-model="filters.members"
          name="select"
          :items="[]"
          :placeholder="i18Texts.selectPlaceholder"
          clearable
          density="comfortable"
          hide-details
          :label="i18Texts.selectLabel"
        />

        <p class="text-p1 text-gray-800 mt-4 mb-2">
          {{ $t('components.learningPlan.drawer.startDate') }}
        </p>
        <div class="d-flex align-center ga-1">
          <alex-inputs-date
            v-model="filters.startDate.start"
            class="flex-1-1"
            name="startDateStart"
            hide-details
            density="comfortable"
          />
          <alex-inputs-date
            v-model="filters.startDate.end"
            class="flex-1-1"
            hide-details
            name="startDateEnd"
            density="comfortable"
          />
        </div>
        <p
          v-if="errors['startDateStart'] || errors['startDateEnd']"
          class="text-error-0 text-body-3 mt-2"
        >
          {{ errors['startDateStart'] || errors['startDateEnd'] }}
        </p>
        <p class="text-p1 text-gray-800 mt-4 mb-2">
          {{ $t('components.learningPlan.drawer.finalDate') }}
        </p>
        <div class="d-flex align-center ga-1">
          <alex-inputs-date
            v-model="filters.finalDate.start"
            name="finalDateStart"
            class="flex-1-1"
            hide-details
            density="comfortable"
          />
          <alex-inputs-date
            v-model="filters.finalDate.end"
            name="finalDateEnd"
            class="flex-1-1"
            hide-details
            density="comfortable"
          />
        </div>
        <p
          v-if="errors['finalDateStart'] || errors['finalDateEnd']"
          class="text-error-0 text-body-3 mt-2"
        >
          {{ errors['finalDateStart'] || errors['finalDateEnd'] }}
        </p>
      </div>
      <hr />
      <div class="d-flex ga-1 px-4">
        <alex-custom-button class="flex-1-1" variant="secondary" size="large" @click="clearFilters">
          {{ $t('components.learningPlan.drawer.clean') }}
        </alex-custom-button>
        <alex-custom-button class="flex-1-1" size="large" type="submit">
          {{ $t('components.learningPlan.drawer.filter') }}
        </alex-custom-button>
      </div>
    </form>
  </v-navigation-drawer>
</template>
