<template>
  <Sheet v-model:open="model" side="right">
    <SheetContent class="tw-rounded-tl-lg !tw-max-w-[380px]">
      <form
        class="d-flex flex-column ga-4 tw-h-full tw-w-full bg-white"
        @submit="onSubmit"
      >
        <div class="d-flex align-center ga-4 px-4 pt-4">
          <p class="text-h4 flex-fill">
            {{ i18Texts.title }}
          </p>
          <alex-custom-button
            icon="mdi-close"
            variant="text"
            size="small"
            flat
            @click="model = false"
          />
        </div>

        <hr class="mb-2" />

        <div class="flex-fill px-4">
          <alex-inputs-select
            v-model="filters.select"
            name="select"
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
          <div v-if="!kanbanFilter" class="mt-4">
            <p class="text-body-1 text-gray-800">
              {{ $t('components.learningPlan.drawer.archivedTasks') }}
            </p>
            <alex-custom-switch
              v-model="filters.archivedTasks"
              class="archived-switch"
              inset
              hide-details
            ></alex-custom-switch>
          </div>
        </div>
        <hr />

        <div class="d-flex ga-1 pa-4 pt-0">
          <alex-custom-button
            class="flex-1-1"
            variant="secondary"
            size="large"
            @click="clearFilters"
            >{{
              $t('components.learningPlan.drawer.clean')
            }}</alex-custom-button
          >
          <alex-custom-button class="flex-1-1" size="large" type="submit">{{
            $t('components.learningPlan.drawer.filter')
          }}</alex-custom-button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { useForm } from 'vee-validate';
const { t } = useI18n();

interface Filter {
  modelValue: boolean;
  kanbanFilter?: boolean;
  classes?: Array<string>;
}

const props = withDefaults(defineProps<Filter>(), {
  classes: () => [],
  kanbanFilter: false,
});

const filters = ref({
  select: null,
  archivedTasks: false,
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
        return scheme
          .optional()
          .min(yup.ref('finalDateStart'), t('rules.endDate.beforeStartDate'));
      }),
    startDateStart: yup.date().optional(),
    startDateEnd: yup
      .date()
      .optional()
      .when('startDateStart', (value, scheme) => {
        if (!value[0]) {
          return scheme;
        }
        return scheme
          .optional()
          .min(yup.ref('startDateStart'), t('rules.endDate.beforeStartDate'));
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

const types = [
  { title: t('components.learningPlan.drawer.group'), value: 'group' },
  {
    title: t('components.learningPlan.drawer.individual'),
    value: 'individual',
  },
];

const emits = defineEmits(['update:modelValue', 'filter']);
const model = defineModel({ default: false });

const onSubmit = handleSubmit(() => {
  const nonEmptyFilters = Object.fromEntries(
    Object.entries(filters.value).filter(([_key, value]) => {
      if (value === null || value === false) {
        return false;
      }
      if (typeof value === 'object') {
        return value.start || value.end;
      }
      return true;
    }),
  );
  emits('filter', nonEmptyFilters);
  model.value = false;
});

const removeFilter = (key: string) => {
  if (key === 'archivedTasks') filters.value[key] = false;
  else if (key === 'select') filters.value[key] = null;
  else
    filters.value[key] = {
      start: undefined,
      end: undefined,
    };
  onSubmit();
};

defineExpose({
  removeFilter,
});

const clearFilters = () => {
  filters.value = {
    select: null,
    archivedTasks: false,
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

<style></style>
