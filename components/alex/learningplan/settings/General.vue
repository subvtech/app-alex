<template>
  <alex-custom-card
    :title="$t(`components.${variant}.settings.general.title`)"
    show-footer-divider
  >
    <template #content>
      <div class="d-flex flex-column w-100">
        <alex-inputs-text-field
          v-model="myTitle"
          name="title"
          :label="$t(`components.${variant}.settings.general.name`)"
          class="w-100"
          :error-messages="errors.title"
          density="comfortable"
          required
        />
        <div v-if="isCourses" class="d-flex flex-column w-100">
          <div class="d-flex w-100 gap-6">
            <alex-inputs-date
              v-model="myStartDate"
              name="startDate"
              :label="$t(`components.courses.settings.general.startDate`)"
              :allowed-dates="disablePastDates"
              required
              density="comfortable"
              :error-messages="errors.startDate"
              class="w-100"
            />

            <alex-inputs-date
              v-model="myEndDate"
              name="endDate"
              :allowed-dates="disablePastDates"
              :label="$t(`components.courses.settings.general.endDate`)"
              required
              density="comfortable"
              :error-messages="errors.endDate"
              class="w-100"
            />
          </div>

          <alex-inputs-text-field
            v-model="myIdentifier"
            name="slug"
            :label="$t(`components.courses.settings.general.identifier.label`)"
            :error-messages="errors.identifier"
            class="w-100"
            required
            :info="$t(`components.courses.settings.general.identifier.tooltip`)"
            :hint="accessUrl"
            density="comfortable"
            persistent-hint
          />
        </div>
        <div v-else>
          <alex-inputs-text-area
            v-model="myDescription"
            :label="$t('components.trails.settings.general.description')"
            name="description"
            class="w-100"
            density="comfortable"
            required
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button
          variant="primary"
          prepend-icon="mdi-check"
          :disabled="theresError"
          @click="onSave"
          >{{
            $t(`components.${variant}.settings.general.save`)
          }}</alex-custom-button
        >
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { find } = useStrapi();
const { setMessage } = useMessageStore();

export interface SettingsGeneralComponentType {
  title: string;
  startDate?: string;
  endDate?: string;
  slug?: string;
  accessUrl?: string;
  description?: string;
  variant: 'courses' | 'trails';
}

const emit = defineEmits(['update']);

const props = withDefaults(defineProps<SettingsGeneralComponentType>(), {
  variant: 'courses',
  startDate: undefined,
  endDate: undefined,
  slug: undefined,
  description: undefined,
  accessUrl: undefined,
});

const i18n = useI18n();
const { generalCourseSchema, generalTrailSchema } = useFormRules();

const learningPlanStore = useLearningPlanStore();
const { title, startDate, endDate, slug } = toRefs(props);
const myTitle = title.value;
const myStartDate = ref(
  learningPlanStore.learningPlan?.start_date || startDate.value,
);
const myEndDate = ref(
  learningPlanStore.learningPlan?.end_date || endDate.value,
);
const myIdentifier = learningPlanStore.learningPlan?.slug || slug.value;
const accessUrl = ref(props.accessUrl);

const isCourses = computed(() => props.variant === 'courses');
const myDescription = ref(props.description);

const { handleSubmit, errors, controlledValues, setFieldError } = useForm({
  validationSchema: isCourses.value ? generalCourseSchema : generalTrailSchema,
  keepValuesOnUnmount: true,
});

const slugFormated = computed(() =>
  controlledValues.value.slug.trim().toLowerCase().replaceAll(' ', '_'),
);

const onSave = handleSubmit(async (e) => {
  if (controlledValues.value.slug !== props.slug && isCourses.value) {
    const isSlugAvailable = await find('learningplans', {
      filters: { slug: controlledValues.value.slug },
    });

    if (isSlugAvailable.data.length !== 0) {
      setFieldError(
        'slug',
        i18n.t('components.courses.settings.general.identifier.unique'),
      );
      setMessage(
        i18n.t('components.courses.settings.general.identifier.unique'),
        'red',
        true,
      );
      return;
    }
  }
  emit(
    'update',
    isCourses.value
      ? {
          title: controlledValues.value.title,
          start_date: new Date(controlledValues.value.startDate).toISOString(),
          end_date: new Date(controlledValues.value.endDate).toISOString(),
          slug: controlledValues.value.slug,
        }
      : {
          title: controlledValues.value.title,
          description: controlledValues.value.description,
        },
  );
});

const theresError = computed(() => Object.keys(errors.value).length !== 0);

const disablePastDates = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parsedDate = new Date(date);
  return parsedDate >= today;
};
</script>
<style scoped lang="scss"></style>
