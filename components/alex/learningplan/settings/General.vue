<template>
  <alex-custom-card
    :title="$t('components.courses.settings.general.title')"
    :show-icon="false"
    show-footer-divider
  >
    <template #content>
      <div v-if="isTrail" class="d-flex flex-column w-100 content-body">
        <alex-inputs-text-field
          :v-model="trailsTitle"
          :label="trails.labelTitle"
          name="title"
          class="w-100"
          density="comfortable"
          :error-messages="errors.title"
          required
        ></alex-inputs-text-field>
        <alex-inputs-text-area
          :v-model="trailsDescription"
          :label="trails.labelDescription"
          name="description"
          class="w-100"
          density="comfortable"
          :error-messages="errors.description"
          required
        ></alex-inputs-text-area>
      </div>
      <div v-else class="d-flex flex-column w-100">
        <alex-inputs-text-field
          v-model="myTitle"
          :label="$t('components.courses.settings.general.courseTitle')"
          name="title"
          class="w-100"
          :error-messages="errors.title"
          required
        ></alex-inputs-text-field>
        <div class="d-flex w-100 gap-6">
          <alex-inputs-date
            v-model="myStartDate"
            name="startDate"
            :label="$t('components.courses.settings.general.startDate')"
            required
            :error-messages="errors.startDate"
            class="w-100"
          />

          <alex-inputs-date
            v-model="myEndDate"
            name="endDate"
            :allowed-dates="disablePastStartDates"
            :label="$t('components.courses.settings.general.endDate')"
            required
            :error-messages="errors.endDate"
            class="w-100"
          />
        </div>

        <alex-inputs-text-field
          v-model="mySlug"
          :label="$t('components.courses.settings.general.slug.label')"
          name="slug"
          :error-messages="errors.slug"
          class="w-100"
          required
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button
          variant="secondary"
          prepend-icon="mdi-close"
          @click="onCancel"
          >{{
            $t('components.courses.settings.general.cancel')
          }}</alex-custom-button
        >
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

import { useI18n } from 'vue-i18n';

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
  isTrail: {
    type: Boolean,
    required: false,
    default: false,
  },
  trailsTitle: {
    type: String,
    required: false,
    default: '',
  },
  trailsDescription: {
    type: String,
    required: false,
    default: '',
  },
});

const i18n = useI18n();

const { generalCourseSchema } = useFormRules();

const { title, startDate, endDate, slug } = toRefs(props);
const myStartDate = toRef(startDate.value);
const myEndDate = toRef(endDate.value);
const myTitle = toRef(title.value);
const mySlug = toRef(slug.value);

const isTrail = toRef(props, 'isTrail');
const trails = ref({
  title: '',
  description: '',
  labelTitle: 'Nome da trilha',
  labelDescription: 'Descrição da trilha',
});

const trailsTitle = toRef(props, 'trailsTitle');
const trailsDescription = toRef(props, 'trailsDescription');

const { handleSubmit, errors, values, controlledValues, setFieldError } =
  useForm({
    validationSchema: generalCourseSchema,
    keepValuesOnUnmount: true,
  });

const onSave = handleSubmit(async (e) => {
  if (controlledValues.value.slug !== slug.value) {
    const isSlugAvailable = await find('learningplans', {
      filters: { slug: controlledValues.value.slug },
    });

    if (isSlugAvailable.data.length !== 0) {
      setFieldError(
        'slug',
        i18n.t('components.courses.settings.general.slug.unique'),
      );
      setMessage(
        i18n.t('components.courses.settings.general.slug.unique'),
        'red',
        true,
      );
      return;
    }
  }

  await update(`learningplans/${props.learningPlanId}`, {
    title: controlledValues.value.title,
    start_date: new Date(controlledValues.value.startDate).toISOString(),
    end_date: new Date(controlledValues.value.endDate).toISOString(),
    slug: controlledValues.value.slug,
  });

  emit('update', i18n.t('components.courses.settings.general.update'));
});

const onCancel = () => {
  myStartDate.value = props.startDate;
  myEndDate.value = props.endDate;
  mySlug.value = props.slug;
  myTitle.value = props.title;
};

const theresError = computed(() => Object.keys(errors.value).length !== 0);

const disablePastDates = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Vuetify uses strings in the format 'YYYY-MM-DD' for dates, so convert the date argument to a Date object
  const parsedDate = new Date(date);

  // If the parsed date is earlier than today, return false to disable it
  return parsedDate >= today;
};

const disablePastStartDates = (date) => {
  if (!disablePastDates(date)) return false;

  const tempDate = new Date(myStartDate.value);
  tempDate.setHours(0, 0, 0, 0);

  const parsedDate = new Date(date);

  return parsedDate >= tempDate;
};

watch(startDate, () => {
  myStartDate.value = startDate.value;
});
watch(endDate, () => {
  myEndDate.value = endDate.value;
});
watch(title, () => {
  myTitle.value = title.value;
});
watch(slug, () => {
  mySlug.value = slug.value;
});
</script>
<style scoped lang="scss">
.content-area {
  margin-top: 24px;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  box-shadow: none !important;
}
</style>
