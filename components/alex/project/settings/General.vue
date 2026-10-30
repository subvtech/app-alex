<template>
  <alex-custom-card :title="$t('components.projects.settings.general.title')" show-footer-divider outline>
    <template #content>
      <div class="d-flex flex-column w-100">
        <alex-inputs-text-field
          v-model="myTitle"
          name="title"
          :label="$t('components.projects.settings.general.name')"
          class="w-100"
          :error-messages="errors.title"
          density="comfortable"
          required
        />
        <alex-inputs-text-area
          v-model="myDescription"
          name="description"
          :label="$t('components.projects.settings.general.description')"
          class="w-100"
          :error-messages="errors.description"
          density="comfortable"
          required
        />
        <div class="d-flex w-100 gap-6">
          <alex-inputs-date
            v-model="myStartDate"
            name="startDate"
            :label="$t('components.projects.settings.general.startDate')"
            required
            density="comfortable"
            :error-messages="errors.startDate"
            class="w-100"
          />
          <alex-inputs-date
            v-model="myEndDate"
            name="endDate"
            :label="$t('components.projects.settings.general.endDate')"
            required
            density="comfortable"
            :error-messages="errors.endDate"
            class="w-100"
          />
        </div>
        <alex-inputs-text-field
          v-model="mySlug"
          name="slug"
          :label="$t('components.projects.settings.general.identifier.label')"
          :error-messages="errors.slug"
          class="w-100"
          required
          :info="$t('components.projects.settings.general.identifier.tooltip')"
          :hint="accessUrl"
          density="comfortable"
          persistent-hint
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex w-100 justify-end gap-4 pt-6">
        <alex-custom-button variant="primary" prepend-icon="mdi-check" :disabled="theresError" @click="onSave">
          {{ $t('components.projects.settings.general.save') }}
        </alex-custom-button>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';

const props = defineProps<{
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  slug: string;
}>();

const emit = defineEmits(['update']);
const { find } = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const { generalProjectSchema } = useFormRules();

const myTitle = ref(props.title);
const myDescription = ref(props.description);
const myStartDate = ref(props.startDate);
const myEndDate = ref(props.endDate);
const mySlug = ref(props.slug);

const { handleSubmit, errors, controlledValues, setFieldError } = useForm({
  validationSchema: generalProjectSchema,
  keepValuesOnUnmount: true,
});

const slugFormatted = computed(() =>
  String(controlledValues.value.slug ?? '')
    .trim()
    .toLowerCase()
    .replaceAll(' ', '_'),
);
const accessUrl = computed(() => `${window.location.origin}/projects/${slugFormatted.value}`);

const onSave = handleSubmit(async (values) => {
  if (slugFormatted.value !== props.slug) {
    const matchingProjects = await find('learningplans', {
      filters: {
        slug: { $eq: slugFormatted.value },
        id: { $ne: props.id },
      },
    });

    if (matchingProjects.data.length !== 0) {
      const message = t('components.projects.settings.general.identifier.unique');
      setFieldError('slug', message);
      setMessage(message, 'red', true);
      return;
    }
  }

  emit('update', {
    title: values.title,
    description: values.description,
    start_date: new Date(values.startDate).toISOString(),
    end_date: new Date(values.endDate).toISOString(),
    slug: slugFormatted.value,
  });
});

const theresError = computed(() => Object.keys(errors.value).length !== 0);
</script>
