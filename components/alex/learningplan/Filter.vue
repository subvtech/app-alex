<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    floating
    scrim="transparent"
    sticky
    :width="380"
    class="py-6 rounded-s-lg"
  >
    <form
      class="d-flex flex-column ga-4 tw-h-full tw-w-full bg-white"
      @submit.stop="onSubmit"
    >
      <div class="d-flex align-center ga-4 px-4">
        <p class="text-h4 flex-fill">
          {{ 'Filtrar' }}
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

      <div class="tw-flex tw-gap-4 tw-flex-col flex-fill px-4">
        <alex-inputs-single-user-auto-complete
          v-model="filters.facilitator"
          name="facilitator"
          clearable
          density="comfortable"
          hide-details
          facilitator
          :placeholder="'Encontre um facilitador'"
          :label="'Facilitador'"
        />
        <alex-inputs-institutions-auto-complete
          v-model="filters.institution"
          name="institution"
          :placeholder="'Encontre a instituição'"
          clearable
          density="comfortable"
          hide-details
          :label="'Instituição'"
        />
        <alex-inputs-autocomplete
          v-if="type === 'project'"
          v-model="filters.lider"
          name="lider"
          :items="['lider 1']"
          :placeholder="'Encontre um líder'"
          clearable
          density="comfortable"
          hide-details
          :label="'Líder'"
        />
        <div v-if="type === 'course'" class="tw-flex tw-flex-col tw-gap-4">
          <alex-inputs-tag-autocomplete
            v-model="filters.technicalCompetences"
            name="technicalCompetence"
            :placeholder="'Encontre a competencia'"
            clearable
            density="comfortable"
            hide-details
            :label="'Competências técnicas'"
          />
          <div
            v-if="filters.technicalCompetences.length"
            class="tw-flex tw-flex-wrap gap-2"
          >
            <template v-for="tag in filters.technicalCompetences" :key="tag.id">
              <alex-custom-chip
                :text="tag?.text"
                status="primary"
                clickable
                closable
                @click:close="handleRemoveTag(tag.text, 'technical')"
              />
            </template>
          </div>
          <alex-inputs-tag-autocomplete
            v-model="filters.generalCompetences"
            name="generalCompetence"
            :placeholder="'Encontre a competencia'"
            clearable
            density="comfortable"
            hide-details
            :label="'Competências gerais'"
          />
          <div
            v-if="filters.generalCompetences.length"
            class="tw-flex tw-flex-wrap gap-2"
          >
            <template v-for="tag in filters.generalCompetences" :key="tag.id">
              <alex-custom-chip
                :text="tag?.text"
                status="primary"
                clickable
                closable
                @click:close="handleRemoveTag(tag.text, 'general')"
              />
            </template>
          </div>
        </div>
        <div>
          <p class="text-p1 text-gray-800 mb-2">
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
        <div>
          <p class="text-p1 text-gray-800 mb-2">
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
        </div>
        <p
          v-if="errors['finalDateStart'] || errors['finalDateEnd']"
          class="text-error-0 text-body-3 mt-2"
        >
          {{ errors['finalDateStart'] || errors['finalDateEnd'] }}
        </p>
      </div>
      <hr />

      <div class="d-flex ga-2 px-4">
        <alex-custom-button
          class="flex-1-1"
          variant="secondary"
          size="large"
          @click="clearFilters"
          >{{ $t('components.learningPlan.drawer.clean') }}</alex-custom-button
        >
        <alex-custom-button class="flex-1-1" size="large" type="submit">{{
          $t('components.learningPlan.drawer.filter')
        }}</alex-custom-button>
      </div>
    </form>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import { useQueryClient } from '@tanstack/vue-query';
const { t } = useI18n();

interface FilterProps {
  type: LearningPlanSimple['type'];
}
export type LearningPlanFilter = {
  facilitator: UserSimple | null;
  institution: InstitutionsType | null;
  generalCompetences: Omit<TagSimple, 'learningplans'>[];
  technicalCompetences: Omit<TagSimple, 'learningplans'>[];
  lider: UserSimple | null;
  startDate: {
    start?: Date;
    end?: Date;
  };
  finalDate: {
    start?: Date;
    end?: Date;
  };
};
type Emits = {
  submit: [value: Partial<LearningPlanFilter>];
};
withDefaults(defineProps<FilterProps>(), {});
const queryClient = useQueryClient();
const model = defineModel({ default: false });
const filters = ref<LearningPlanFilter>({
  facilitator: null,
  generalCompetences: [],
  technicalCompetences: [],
  institution: null,
  lider: null,
  startDate: {
    start: undefined,
    end: undefined,
  },
  finalDate: {
    start: undefined,
    end: undefined,
  },
});
const handleChange = (value: boolean) => {
  model.value = value;
};
const emits = defineEmits<Emits>();
// const i18Texts = computed(() => {
//   const drawer = 'components.learningPlan.drawer';
//   return props.type === 'course'
//     ? {
//         title: t(`${drawer}.filter`),
//         selectPlaceholder: t(`${drawer}.selectClassPlaceholder`),
//         selectLabel: t(`${drawer}.class`),
//       }
//     : {
//         title: t(`${drawer}.filterTasks`),
//         selectPlaceholder: t(`${drawer}.selectTypePlaceholder`),
//         selectLabel: t(`${drawer}.type`),
//       };
// });
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

const onSubmit = handleSubmit(() => {
  const nonEmptyFilters: Partial<LearningPlanFilter> = Object.fromEntries(
    Object.entries(filters.value).filter(([_key, value]) => {
      if (value === null || value === undefined) {
        return false;
      }
      if (
        typeof value === 'object' &&
        !(value as LearningPlanFilter['startDate'])?.start &&
        !(value as LearningPlanFilter['finalDate'])?.end
      ) {
        return false;
      }
      if (Array.isArray(value) && !value.length) return false;
      return true;
    }),
  );
  emits('submit', nonEmptyFilters);
  handleChange(false);
});

const removeFilter = (key: keyof typeof filters.value) => {
  if (key === 'startDate' || key === 'finalDate') {
    filters.value[key] = {
      start: undefined,
      end: undefined,
    };
  } else if (key === 'generalCompetences' || key === 'technicalCompetences') {
    filters.value[key] = [];
  } else {
    filters.value[key] = null;
  }
  onSubmit();
};

const clearFilters = () => {
  const cleanedFilters: LearningPlanFilter = {
    facilitator: null,
    generalCompetences: [],
    technicalCompetences: [],
    institution: null,
    lider: null,
    startDate: {
      start: undefined,
      end: undefined,
    },
    finalDate: {
      start: undefined,
      end: undefined,
    },
  };
  emits('submit', cleanedFilters);
};
const handleRemoveTag = (text: string, type: 'technical' | 'general') => {
  if (type === 'technical') {
    filters.value.technicalCompetences =
      filters.value.technicalCompetences.filter((tag) => tag.text !== text);
    return;
  }
  filters.value.generalCompetences = filters.value.generalCompetences.filter(
    (tag) => tag.text !== text,
  );
};
watch(model, () => {
  if (model.value) {
    queryClient.invalidateQueries({ queryKey: ['single-user-auto-complete'] });
  }
});
defineExpose({
  removeFilter,
});
</script>

<style></style>
