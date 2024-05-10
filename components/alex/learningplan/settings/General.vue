<template>
  <alex-custom-card
    :title="$t('components.courses.settings.general.title')"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <div class="d-flex flex-column w-100">
        <alex-inputs-text-field
          v-model="myTitle"
          name="title"
          :label="$t('components.courses.settings.general.courseTitle')"
          class="w-100"
          :error-messages="errors.title"
          required
        ></alex-inputs-text-field>
        <div class="d-flex w-100 gap-6">
          <alex-inputs-date
            v-model="myStartDate"
            name="startDate"
            :label="$t('components.courses.settings.general.startDate')"
            :allowed-dates="disablePastDates"
            required
            :error-messages="errors.startDate"
            class="w-100"
          />

          <alex-inputs-date
            v-model="myEndDate"
            name="endDate"
            :allowed-dates="disablePastDates"
            :label="$t('components.courses.settings.general.endDate')"
            required
            :error-messages="errors.endDate"
            class="w-100"
          />
        </div>

        <alex-inputs-text-field
          v-model="myIdentifier"
          name="slug"
          :label="$t('components.courses.settings.general.identifier.label')"
          :error-messages="errors.identifier"
          class="w-100"
          required
          :info="$t('components.courses.settings.general.identifier.tooltip')"
          :hint="accessUrl"
          persistent-hint
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button
          variant="primary"
          prepend-icon="mdi-check"
          @click="onSave"
          :disabled="theresError"
          >{{
            $t('components.courses.settings.general.save')
          }}</alex-custom-button
        >
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const { find, update } = useStrapi();
const { setMessage } = useMessageStore();

const emit = defineEmits(['update']);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  learningPlanId: {
    type: Number,
    required: true,
  },
  accessUrl: {
    type: String,
    required: true,
  },
});

const i18n = useI18n();
const { generalCourseSchema } = useFormRules();

const learningPlanStore = useLearningPlanStore();
const { title, startDate, endDate, slug } = toRefs(props);
const myTitle = learningPlanStore.learningPlan?.title || title.value;
const myStartDate = ref(
  learningPlanStore.learningPlan?.start_date || startDate.value,
);
const myEndDate = ref(
  learningPlanStore.learningPlan?.end_date || endDate.value,
);
const myIdentifier = learningPlanStore.learningPlan?.slug || slug.value;
const accessUrl = ref(props.accessUrl);

const { handleSubmit, errors, controlledValues, setFieldError } = useForm({
  validationSchema: generalCourseSchema,
  keepValuesOnUnmount: true,
});

const slugFormatted = computed(() =>
  controlledValues.value.slug.trim().toLowerCase().replaceAll(' ', '_'),
);

const onSave = handleSubmit(async (e) => {
  if (controlledValues.value.slug !== slug.value) {
    const isSlugAvailable = await find('learningplans', {
      filters: { slug: controlledValues.value.slug },
    });

    if (
      isSlugAvailable.data.length &&
      isSlugAvailable.data[0]?.id !== props.learningPlanId
    ) {
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

  emit('update', props.learningPlanId, {
    title: controlledValues.value.title,
    start_date: controlledValues.value.startDate,
    end_date: controlledValues.value.endDate,
    slug: slugFormatted.value.toLocaleLowerCase(),
  });
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
